'use strict';

/**
 * Routes for stb-myaccount plugin (Core Business Domain)
 */
module.exports = (apiRouter, controllers, middlewares) => {
  const {
    applicantController,
    appointmentController,
    negotiatorController,
    offerController,
    propertyController,
  } = controllers;

  const { auth, authorizeApi } = middlewares;

  // Negotiators
  apiRouter.get('/negotiators', auth, authorizeApi, negotiatorController.findAll);
  apiRouter.get('/negotiators/:id', auth, authorizeApi, negotiatorController.findOne);
  apiRouter.post('/negotiators', auth, authorizeApi, negotiatorController.create);
  apiRouter.put('/negotiators/:id', auth, authorizeApi, negotiatorController.update);
  apiRouter.del('/negotiators/:id', auth, authorizeApi, negotiatorController.destroy);

  // Properties
  apiRouter.get('/properties', auth, authorizeApi, propertyController.findAll);
  apiRouter.get('/properties/:id', auth, authorizeApi, propertyController.findOne);
  apiRouter.post('/properties', auth, authorizeApi, propertyController.create);
  apiRouter.put('/properties/:id', auth, authorizeApi, propertyController.update);
  apiRouter.del('/properties/:id', auth, authorizeApi, propertyController.destroy);

  // Applicants
  apiRouter.get('/applicants', auth, authorizeApi, applicantController.findAll);
  apiRouter.get('/applicants/:id', auth, authorizeApi, applicantController.findOne);
  apiRouter.post('/applicants', auth, authorizeApi, applicantController.create);
  apiRouter.put('/applicants/:id', auth, authorizeApi, applicantController.update);
  apiRouter.del('/applicants/:id', auth, authorizeApi, applicantController.destroy);

  // Offers
  apiRouter.get('/offers', auth, authorizeApi, offerController.findAll);
  apiRouter.get('/offers/:id', auth, authorizeApi, offerController.findOne);
  apiRouter.post('/offers', auth, authorizeApi, offerController.create);
  apiRouter.put('/offers/:id', auth, authorizeApi, offerController.update);
  apiRouter.del('/offers/:id', auth, authorizeApi, offerController.destroy);

  // Appointments
  apiRouter.get('/appointments', auth, authorizeApi, appointmentController.findAll);
  apiRouter.get('/appointments/:id', auth, authorizeApi, appointmentController.findOne);
  apiRouter.post('/appointments', auth, authorizeApi, appointmentController.create);
  apiRouter.put('/appointments/:id', auth, authorizeApi, appointmentController.update);
  apiRouter.del('/appointments/:id', auth, authorizeApi, appointmentController.destroy);
};
