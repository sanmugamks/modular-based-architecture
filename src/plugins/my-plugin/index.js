'use strict';

const server = require('./server');
const config = require('./config');

/**
 * Main entry point for the plugin.
 * Following Strapi-like structure but adapted for Koa POC.
 */
module.exports = async (app, { config: userConfig, apiRouter, auth, authorizeApi, sequelize, DataTypes }) => {
  console.log(`[Plugin: my-plugin] Initializing Standardized Architecture...`);

  // 1. Setup Configuration
  // Merge default config with user-provided config
  const pluginConfig = { ...config.default, ...userConfig };

  // 2. Initialize Models
  const PluginNote = server.models.Note(sequelize, DataTypes);

  // 3. Initialize Services
  const service = server.services.NoteService(PluginNote);

  // 4. Initialize Controllers
  const controller = server.controllers.NoteController(service);

  // 5. Register Routes
  server.routes(apiRouter, auth, authorizeApi, controller);

  // Example: Attach a custom context property
  app.context.myPlugin = {
    config: pluginConfig,
    service, 
    model: PluginNote
  };

  console.log('[Plugin: my-plugin] Architecture initialized successfully.');

  // 6. Return metadata for AdminJS registration or other hooks
  return {
    adminResources: [
      {
        resource: PluginNote,
        options: {
          navigation: { name: 'Plugins', icon: 'Folder' },
        }
      }
    ]
  };
};
