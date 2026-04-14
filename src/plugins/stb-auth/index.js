'use strict';

const argon2 = require('argon2');
const server = require('./server');

/**
 * Main entry point for stb-auth plugin.
 * Handles Identity, Authentication, and RBAC (API and Admin).
 */
module.exports = async (app, { config, apiRouter, sequelize, DataTypes }) => {
  console.log(`[Plugin: stb-auth] Initializing...`);

  // 1. Initialize Models (API and Admin)
  const models = server.models(sequelize, DataTypes);

  // 2. Initialize Services (Passport)
  const passport = server.services.passportService({ models, config });
  
  // 3. Initialize Middlewares
  const auth = passport.authenticate('jwt', { session: false });
  const authorizeApi = server.middlewares.authorizeApi({ models });

  // 4. Shared Context
  app.context.auth = auth;
  app.context.authorizeApi = authorizeApi;

  // 5. Initialize Controllers
  const authController = server.controllers.authController({ models, config });

  // 6. Register Routes
  server.routes(apiRouter, { authController }, { auth, authorizeApi });

  console.log('[Plugin: stb-auth] Initialized successfully.');

  // 7. Return metadata
  return {
    models, 
    middlewares: { auth, authorizeApi },
    adminResources: [
      // API Identity
      {
        resource: models.ApiUser,
        options: { 
          navigation: { name: 'Identity', icon: 'User' },
          properties: {
            password: { isVisible: false },
            newPassword: {
              type: 'password',
              isVisible: { list: false, filter: false, show: false, edit: true },
            },
          },
          actions: {
            new: {
              before: async (request) => {
                if (request.payload && request.payload.newPassword) {
                  const encryptedPassword = await argon2.hash(request.payload.newPassword);
                  return {
                    ...request,
                    payload: { ...request.payload, password: encryptedPassword },
                  };
                }
                return request;
              },
            },
            edit: {
              before: async (request) => {
                if (request.method === 'post' && request.payload) {
                  const { newPassword, ...otherParams } = request.payload;
                  if (newPassword && newPassword.trim() !== '') {
                    const encryptedPassword = await argon2.hash(newPassword);
                    return {
                      ...request,
                      payload: { ...otherParams, password: encryptedPassword },
                    };
                  } else {
                    return { ...request, payload: otherParams };
                  }
                }
                return request;
              },
              after: async (response) => {
                if (response.record && response.record.params) {
                  delete response.record.params.password;
                  delete response.record.params.newPassword;
                }
                return response;
              },
            },
          },
        }
      },
      {
        resource: models.ApiRole,
        options: { navigation: { name: 'Identity', icon: 'Settings' } }
      },
      {
        resource: models.ApiPermission,
        options: { navigation: { name: 'Identity', icon: 'Lock' } }
      },
      // Admin Identity
      {
        resource: models.AdminUser,
        options: { navigation: { name: 'System', icon: 'Shield' } }
      },
      {
        resource: models.AdminRole,
        options: { navigation: { name: 'System', icon: 'Users' } }
      },
      {
        resource: models.AdminPermission,
        options: { navigation: { name: 'System', icon: 'Lock' } }
      }
    ]
  };
};
