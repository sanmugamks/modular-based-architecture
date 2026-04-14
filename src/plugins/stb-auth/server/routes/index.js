'use strict';

/**
 * Routes for stb-auth plugin
 */
module.exports = (apiRouter, controllers, middlewares) => {
  const { authController } = controllers;
  /**
   * Note: These are registered on the main apiRouter.
   * Since the main router has a /api prefix, these become /api/auth/...
   */

  // Public Routes
  apiRouter.post('/auth/register', authController.register);
  apiRouter.post('/auth/login', authController.login);

  // Protected Routes
  apiRouter.get('/auth/me', middlewares.auth, middlewares.authorizeApi, authController.me);
};
