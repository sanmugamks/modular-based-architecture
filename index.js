require('dotenv').config();
const Koa = require('koa');
const argon2 = require('argon2');
const passport = require('./middleware/passport');

// Database Models
const { sequelize, AdminUser, AdminRole, AdminPermission, ApiUser, ApiRole, ApiPermission, Negotiator, Property, Applicant, Offer, Appointment } = require('./models');

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

  const adminJs = new AdminJS({
    databases: [sequelize],
    resources: [AdminUser, ApiUser, Negotiator, Property, Applicant, Offer, Appointment],
    rootPath: '/admin',
  });

  // AdminJS Auth logic
  const adminRouter = AdminJSKoa.buildAuthenticatedRouter(adminJs, app, {
    authenticate: async (email, password) => {
      const user = await AdminUser.findOne({ where: { email } });
      if (user && await argon2.verify(user.password, password)) {
        return user; 
      }
      return null;
    },
    cookiePassword: process.env.COOKIE_PASSWORD || 'some-secret-password-longer-than-32-chars',
  });

  // --- 2. API Routes (from centralized router) ---
  const apiRouter = require('./routes/api');

  // Middleware order matters: passport -> routes
  app.use(passport.initialize()); 
  app.use(apiRouter.routes());
  app.use(apiRouter.allowedMethods());
  app.use(adminRouter.routes());
  app.use(adminRouter.allowedMethods());

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin Dashboard available at http://localhost:${PORT}/admin`);
  });
}

start();
