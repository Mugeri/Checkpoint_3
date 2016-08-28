var userRoutes = require('./user.js');
var documentRoutes = require('./document.js')

const router = (app) => {
  app.use('/api/users', userRoutes);
  app.use('/api/documents', documentRoutes);
};

module.exports = router;
