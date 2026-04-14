'use strict';

const controllers = {
  authController: require('./controllers/AuthController')
};

const models = require('./models');
const services = {
  passportService: require('./services/PassportService')
};

const middlewares = {
  authorizeApi: require('./middleware/authorizeApi')
};

const routes = require('./routes');

module.exports = {
  controllers,
  models,
  services,
  middlewares,
  routes
};
