module.exports = (apiRouter, auth, authorizeApi, controller) => {
  // Note: These will have the /api prefix from the main apiRouter
  apiRouter.get('/plugin-notes', auth, authorizeApi, controller.findAll);
  apiRouter.get('/plugin-notes/:id', auth, authorizeApi, controller.findOne);
  apiRouter.post('/plugin-notes', auth, authorizeApi, controller.create);
  apiRouter.put('/plugin-notes/:id', auth, authorizeApi, controller.update);
  apiRouter.del('/plugin-notes/:id', auth, authorizeApi, controller.destroy);
};
