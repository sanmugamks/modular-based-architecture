'use strict';

/**
 * Extension for my-plugin
 * This demonstrates how to overwrite or extend plugin controllers and services.
 */
module.exports = (server) => {
  console.log('[Extension: my-plugin] Applying overrides...');

  // Overwriting the NoteController factory
  const originalNoteControllerFactory = server.controllers.NoteController;

  server.controllers.NoteController = (NoteService) => {
    // Instantiate the original controller
    const controller = originalNoteControllerFactory(NoteService);

    // Keep the original findAll method
    const originalFindAll = controller.findAll;

    // Overwrite findAll with custom logic
    controller.findAll = async (ctx) => {
      console.log('[Extension: my-plugin] Intercepted NoteController.findAll - Adding custom logic');
      
      // Add a custom header to the response
      ctx.set('X-Plugin-Extension', 'Active');

      // Call the original implementation (or replace it entirely)
      return originalFindAll(ctx);
    };

    return controller;
  };

  console.log('[Extension: my-plugin] Overrides applied successfully.');
};
