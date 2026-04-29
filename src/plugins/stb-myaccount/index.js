'use strict';

const server = require('./server');

/**
 * Main entry point for stb-myaccount plugin.
 * Handles core business domain entities and logic.
 */
const plugin = async (
  app,
  { config, apiRouter, sequelize, DataTypes, extension, auth, authorizeApi }
) => {
  console.log(`[Plugin: stb-myaccount] Initializing...`);

  // 1. Initialize Models
  const models = server.models(sequelize, DataTypes);

  // 2. Initialize Services
  const services = {};
  if (server.services) {
    for (const [name, factory] of Object.entries(server.services)) {
      services[name] = factory({ models, config });
    }
  }

  // 3. Initialize Controllers via factories
  const context = { models, config, services };
  const controllers = {};
  for (const [name, factory] of Object.entries(server.controllers)) {
    controllers[name] = factory(context);
  }

  // 4. Apply Extension if available
  if (extension) {
    extension({ controllers, models, config, services });
  }

  // 5. Register Routes
  server.routes(apiRouter, controllers, { auth, authorizeApi });

  console.log('[Plugin: stb-myaccount] Initialized successfully.');

  // 6. Return metadata for AdminJS and model registry
  return {
    models,
    services,
    adminResources: [
      {
        resource: models.Negotiator,
        options: { navigation: { name: 'Business', icon: 'Users' } },
      },
      {
        resource: models.Property,
        options: { navigation: { name: 'Business', icon: 'Home' } },
      },
      {
        resource: models.Applicant,
        options: { navigation: { name: 'Business', icon: 'UserPlus' } },
      },
      {
        resource: models.Offer,
        options: { navigation: { name: 'Business', icon: 'DollarSign' } },
      },
      {
        resource: models.Appointment,
        options: { navigation: { name: 'Business', icon: 'Calendar' } },
      },
    ],
  };
};

module.exports = plugin;
