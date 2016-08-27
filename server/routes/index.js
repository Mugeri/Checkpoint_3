var routes = require('./routes.js');

module.exports = (app) => {
  app.use('/api', routes);
};
