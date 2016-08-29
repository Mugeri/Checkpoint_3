const LocalStrategy = require('passport-local').Strategy;
const User = require('../server/models/user.js');

//expose the function to the app using module.exports
module.exports = function(passport) {

  //serialize user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local', new LocalStrategy({
    //by default, local strategy uses username and password
    passReqToCallback: true //pass back entire request to the callback
  },
  function(req, userName, password, done) {
    //async
    //findOne wont fire unless data is sent back

      User.findOne({'local.userName': userName}, function(err, user) {
        if(err) {
          return done(err);
        }
        if(!user) {
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        }
        if(!user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'wrong password.'));
        }
        //if all is well
        res.json({ message: 'Logged in!'});
        return done(null, user);


      });
  }));
}
