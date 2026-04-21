'use strict';

/**
 * Extension for my-plugin
 * This demonstrates how to overwrite or extend plugin controllers and services.
 */
module.exports = ({ controllers, models, services, config }) => {
  console.log('[Extension: my-plugin] Applying overrides...');

  const controller = controllers.NoteController;
  if (!controller) {
    console.error('[Extension: my-plugin] NoteController not found for extension.');
    return;
  }

  // Keep the original findAll method
  const originalFindAll = controller.findAll;

  // Overwrite findAll with custom logic
  controller.findAll = async (ctx) => {
    console.log('[Extension: my-plugin] Intercepted NoteController.findAll - Adding custom logic');
    
    // Add a custom header to the response
    ctx.set('X-Plugin-Extension', 'Active (my-plugin)');

    // Call the original implementation
    return originalFindAll(ctx);
  };

  console.log('[Extension: my-plugin] Overrides applied successfully.');
};
