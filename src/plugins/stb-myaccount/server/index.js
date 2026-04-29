'use strict';

const controllers = {
  applicantController: require('./controllers/ApplicantController'),
  appointmentController: require('./controllers/AppointmentController'),
  negotiatorController: require('./controllers/NegotiatorController'),
  noteController: require('./controllers/NoteController'),
  offerController: require('./controllers/OfferController'),
  propertyController: require('./controllers/PropertyController'),
};

const models = require('./models');
const routes = require('./routes');
const services = require('./services');

module.exports = {
  controllers,
  models,
  routes,
  services,
};
