'use strict';

const server = require('./server');
const config = require('./config');

/**
 * Main entry point for the plugin.
 * Following Strapi-like structure but adapted for Koa POC.
 */
module.exports = async (
  app,
  { config: userConfig, apiRouter, auth, authorizeApi, sequelize, DataTypes, extension }
) => {
  console.log(`[Plugin: my-plugin] Initializing Standardized Architecture...`);

  // 1. Setup Configuration
  const pluginConfig = { ...config.default, ...userConfig };

  // 2. Initialize Models
  const PluginNote = server.models.Note(sequelize, DataTypes);
  const models = { Note: PluginNote };

  // 3. Initialize Services
  const services = {};
  if (server.services) {
    for (const [name, factory] of Object.entries(server.services)) {
      // In this specific plugin, NoteService expects just the model as per its definition
      services[name] =
        name === 'NoteService' ? factory(PluginNote) : factory({ models, config: pluginConfig });
    }
  }

  // 4. Initialize Controllers via factories
  const controllers = {};
  if (server.controllers) {
    for (const [name, factory] of Object.entries(server.controllers)) {
      // NoteController expects NoteService
      controllers[name] =
        name === 'NoteController'
          ? factory(services.NoteService)
          : factory({ models, config: pluginConfig, services });
    }
  }

  // --- Apply Extensions ---
  if (extension && typeof extension === 'function') {
    extension({ controllers, models, services, config: pluginConfig });
  }

  // 5. Register Routes
  // Note: Standardizing route registration to match others if possible
  if (typeof server.routes === 'function') {
    server.routes(apiRouter, auth, authorizeApi, controllers.NoteController);
  }

  console.log('[Plugin: my-plugin] Architecture initialized successfully.');

  // 6. Return metadata for AdminJS registration or other hooks
  return {
    models,
    services,
    adminResources: [
      {
        resource: PluginNote,
        options: {
          navigation: { name: 'Plugins', icon: 'Folder' },
        },
      },
    ],
  };
};
