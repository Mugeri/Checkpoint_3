var userRoutes = require('./user.js');
var documentRoutes = require('./document.js');
var rolesRoutes = require('./roles.js');

const router = (app, passport) => {
  app.use('/api/users', userRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/roles', rolesRoutes);
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
