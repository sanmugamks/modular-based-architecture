'use strict';

/**
 * stb-auth Extension
 *
 * Use this file to override or extend the stb-auth plugin logic.
 * The function receives the plugin's controllers, models, and config.
 */
module.exports = ({ controllers, models, config, services }) => {
  console.log('[Extension: stb-auth] Initializing lifecycle hooks and schema extensions...');
  const { emailService } = services;
  const { ApiUser } = models;
  const { DataTypes } = ApiUser.sequelize.Sequelize;

  console.log('config => ', config);

  // --- Schema Extensions ---
  // Add project-specific custom fields to the ApiUser model
  ApiUser.rawAttributes.forename = {
    type: DataTypes.STRING,
    allowNull: true,
  };
  ApiUser.rawAttributes.surname = {
    type: DataTypes.STRING,
    allowNull: true,
  };

  // Refresh attributes so Sequelize registers the newly added columns before syncing
  ApiUser.refreshAttributes();

  // --- Model Lifecycle Hooks ---

  // 1. After Create User Hook
  ApiUser.addHook('afterCreate', async (user, options) => {
    await emailService.sendTemplate(
      'welcome-email',
      { email: user.email },
      ApiUser.sequelize.models
    );
  });

  // 2. After Update User Hook
  ApiUser.addHook('afterUpdate', async (user, options) => {
    await emailService.sendTemplate(
      'account-update',
      { email: user.email },
      ApiUser.sequelize.models
    );
  });

  console.log('[Extension: stb-auth] Lifecycle hooks and extensions registered successfully.');
};
