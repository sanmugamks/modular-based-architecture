'use strict';

/**
 * stb-auth Extension
 * 
 * Use this file to override or extend the stb-auth plugin logic.
 * The function receives the plugin's controllers, models, and config.
 */
module.exports = ({ controllers, models, config }) => {
  console.log('[Extension: stb-auth] Loaded.');
  
  // Example: Override a controller method
  // const { authController } = controllers;
  // const originalLogin = authController.login;
  // authController.login = async (ctx) => { 
  //   console.log('Custom login logic before...');
  //   return originalLogin(ctx);
  // };
};
