'use strict';

const emailServiceFactory = require('./server/services/EmailService');
const emailTemplateModel = require('./server/models/EmailTemplate');

/**
 * stb-email plugin
 */
module.exports = async (app, { sequelize, DataTypes }) => {
  console.log('[Plugin: stb-email] Initializing...');

  // 1. Initialize Models
  const EmailTemplate = emailTemplateModel(sequelize, DataTypes);
  const models = { EmailTemplate };

  // 2. Initialize Services
  const emailService = emailServiceFactory({ models });

  // 3. Share service with app context for global access
  app.context.emailService = emailService;

  console.log('[Plugin: stb-email] Initialized successfully.');

  return {
    models,
    services: { emailService },
    adminResources: [
      {
        resource: EmailTemplate,
        options: {
          navigation: { name: 'Communications', icon: 'Mail' },
          properties: {
            body: { type: 'textarea' },
            params: { type: 'json' }
          }
        }
      }
    ]
  };
};
