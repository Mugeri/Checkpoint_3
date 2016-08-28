
const router = require('express').Router();
const User = require('./../models/User.js');
const Roles = require('./../models/roles.js');


{
  //middleware to use for all requests
  //you can use it to make sure that everything
  //coming from a request is safe. You can even throw errors
  //here.
  router.use(function(req, res, next) {
    //do logging
    console.log('Something is happening. ')
    next();
  });

  //test route to make sure everything is working
  // router.get('/', function(req, res) {
  //   res.json({ message: 'Hooray! welcome to my api!'});
  // });

  router.route('/')

    //create a user
    .post(function(req, res) {
      var user = new User(); //create a new instance of the User models
      user.userName = req.body.userName;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      user.password = req.body.password;

      //save the user and check for errors
      user.save(function(err) {
        if(err) {
          res.send(err);
        }
        res.json({ message: 'User created!' });
      });
    })
    .get(function(req, res) {
      User.find(function(err, users) {
        if(err) {
          res.send(err);
        }
        res.json(users);
      });
    });

  router.route('/:user_id')

    //get the user with that id
    .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if(err){
          res.send(err);
        }
        res.json(user);
      });
    })

    //update the user with given id
    .put(function(req, res) {

      User.findById(req.params.user_id, function(err, user) {
        if(err) {
          res.send(err);
        }
        //update the user info
        user.userName = req.body.userName;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.password = req.body.password;

        user.save(function(err) {
          if(err) {
            res.send(err);
          }
          res.json({ message: 'User updated!'});
        });
      });
    })
    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if(err) {
          res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
      });
    });
}
module.exports = router;
