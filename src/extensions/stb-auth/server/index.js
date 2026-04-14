'use strict';

/**
 * stb-auth Extension
 * 
 * Use this file to override or extend the stb-auth plugin logic.
 * The function receives the plugin's controllers, models, and config.
 */
module.exports = ({ controllers, models, config, services }) => {
  console.log('[Extension: stb-auth] Initializing lifecycle hooks...');
  const { emailService } = services;
  const { ApiUser } = models;

  // --- Model Lifecycle Hooks ---

  // 1. After Create User Hook
  ApiUser.addHook('afterCreate', async (user, options) => {
    await emailService.sendTemplate('welcome-email', { email: user.email }, models);
  });

  // 2. After Update User Hook
  ApiUser.addHook('afterUpdate', async (user, options) => {
    await emailService.sendTemplate('account-update', { email: user.email }, models);
  });

  console.log('[Extension: stb-auth] Lifecycle hooks registered successfully.');
};
