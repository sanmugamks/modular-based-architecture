'use strict';

const controllers = {
  applicantController: require('./controllers/ApplicantController'),
  appointmentController: require('./controllers/AppointmentController'),
  negotiatorController: require('./controllers/NegotiatorController'),
  offerController: require('./controllers/OfferController'),
  propertyController: require('./controllers/PropertyController')
};

const models = require('./models');
const routes = require('./routes');

module.exports = {
  controllers,
  models,
  routes
};
