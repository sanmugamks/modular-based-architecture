require('dotenv').config();
const Koa = require('koa');
const argon2 = require('argon2');
const errorHandler = require('./middleware/errorHandler');
const logger = require('koa-logger');
// Database Models
const coreModels = require('./models');
const { sequelize } = coreModels;

const app = new Koa();
app.keys = [process.env.COOKIE_PASSWORD || 'some-secret-password-longer-than-32-chars'];

async function start() {
  // ESM Imports
  const { default: AdminJS } = await import('adminjs');
  const { default: AdminJSKoa } = await import('@adminjs/koa');
  const AdminJSSequelize = await import('@adminjs/sequelize');

  AdminJS.registerAdapter({
    Database: AdminJSSequelize.Database,
    Resource: AdminJSSequelize.Resource,
  });

  // --- Initialize Models Registry ---
  const allModels = { ...coreModels };

  // --- Load API Router & Base Middlewares ---
  app.use(errorHandler); // Catch errors from all downstream middlewares/plugins
  app.use(logger());
  const apiRouter = require('./routes/api');
  const { DataTypes } = require('./config/database');

  // --- Load Plugins ---
  const pluginConfig = require('./config/plugins');
  const pluginResources = [];

  for (const [pluginName, settings] of Object.entries(pluginConfig)) {
    if (settings.enabled) {
      try {
        let plugin;
        try {
          // 1. Try to load from node_modules first (for future NPM package support)
          plugin = require(pluginName);
        } catch (e) {
          try {
            // 2. Fallback to local plugins folder
            plugin = require(`./plugins/${pluginName}`);
          } catch (localErr) {
            throw new Error(`Plugin "${pluginName}" not found in node_modules or local directory.`);
          }
        }

        // --- Check for Extensions ---
        const path = require('path');
        const fs = require('fs');
        const extensionPath = path.join(__dirname, 'extensions', pluginName, 'server', 'index.js');
        let extension = null;
        if (fs.existsSync(extensionPath)) {
          extension = require(extensionPath);
          console.log(`[Plugin Loader] Grouping extension for "${pluginName}"`);
        }

        // Plugins can now define models, routes, and admin resources
        const result = await plugin(app, {
          config: settings.config || {},
          apiRouter,
          auth: app.context.auth, // These will be assigned by stb-auth
          authorizeApi: app.context.authorizeApi,
          sequelize,
          DataTypes,
          extension
        });

        // Register models from plugins into our global registry
        if (result && result.models) {
          Object.assign(allModels, result.models);
        }

        if (result && result.adminResources) {
          pluginResources.push(...result.adminResources);
        }
      } catch (err) {
        console.error(`[Plugin Loader] Failed to load plugin "${pluginName}":`, err.message);
      }
    }
  }

  // --- Associations Phase ---
  // Run late-binding associations between core models and plugin models
  allModels.associateModels(allModels);

  const adminJs = new AdminJS({
    resources: [
      ...pluginResources
    ],
    rootPath: '/admin',
  });

  // AdminJS Auth logic
  const adminRouter = AdminJSKoa.buildAuthenticatedRouter(adminJs, app, {
    authenticate: async (email, password) => {
      // AdminUser is now provided by the stb-auth plugin
      if (!allModels.AdminUser) {
        console.error('AdminUser model not found. Ensure stb-auth plugin is loaded.');
        return null;
      }
      const user = await allModels.AdminUser.findOne({ where: { email } });
      if (user && await argon2.verify(user.password, password)) {
        return user; 
      }
      return null;
    },
    cookiePassword: process.env.COOKIE_PASSWORD || 'some-secret-password-longer-than-32-chars',
  });

  // Middleware order matters: routes
  app.use(apiRouter.routes());
  app.use(apiRouter.allowedMethods());
  app.use(adminRouter.routes());
  app.use(adminRouter.allowedMethods());

  // Ensure database tables exist (important for dynamic plugin models)
  await sequelize.sync({ alter: true });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin Dashboard available at http://localhost:${PORT}/admin`);
  });
}

start();
