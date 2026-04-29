'use strict';

const controllers = require('./controllers');
const models = require('./models');
const routes = require('./routes');
const middlewares = {
  authorizeApi: require('./middleware/authorizeApi'),
};
const services = {
  passportService: require('./services/PassportService'),
};

module.exports = {
  controllers,
  models,
  routes,
  middlewares,
  services,
};
