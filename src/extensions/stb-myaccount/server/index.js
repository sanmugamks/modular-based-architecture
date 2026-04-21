'use strict';

/**
 * Extension for my-plugin
 * This demonstrates how to overwrite or extend plugin controllers and services.
 */
module.exports = ({ controllers, models, services, config }) => {
  console.log('[Extension: stb-myaccount] Applying overrides...');

  const controller = controllers.offerController;
  if (!controller) {
    console.warn('[Extension: stb-myaccount] offerController not found for extension.');
    return;
  }

  // Keep the original findAll method
  const originalFindAll = controller.findAll;

  // Overwrite findAll with custom logic
  controller.findAll = async (ctx) => {
    console.log('[Extension: stb-myaccount] Intercepted offerController.findAll - Adding project logic');
    
    // Add a custom header to the response
    ctx.set('X-Plugin-Extension', 'Active (stb-myaccount)');

    // Call the original implementation
    return originalFindAll(ctx);
  };

  console.log('[Extension: stb-myaccount] Overrides applied successfully.');
};
