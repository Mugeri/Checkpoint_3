const User = require('./../models/User.js');
const secret = process.env.SECRET;
const nJwt = require('njwt');

const userCntrl = {
  createUser: function(req, res) {
    var user = new User(); //create a new instance of the User models
    user.userName = req.body.userName;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = user.generateHash(req.body.password);

    //save the user and check for errors
    user.save(function(err) {
      if(err) {
        res.send(err);
      }
      res.json({ message: 'User created!' });
    });
  },
  getAllUsers: function(req, res) {
    User.find(function(err, users) {
      if(err) {
        res.send(err);
      }
      res.json(users);
    });
  },

  getSpecificUser: function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if(err){
        res.send(err);
      }
      res.json(user);
    });
  },

  updateUser: function(req, res) {

    User.findById(req.params.user_id, function(err, user) {
      if(err) {
        res.send(err);
      }
      //update the user info
      user.userName = req.body.userName;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      user.password = user.generateHash(req.body.password);

      user.save(function(err) {
        if(err) {
          res.send(err);
        }
        res.json({ message: 'User updated!'});
      });
    });
  },

  deleteUser: function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if(err) {
        res.send(err);
      }
      res.json({ message: 'Successfully deleted' });
    });
  },
  login : function(req, res) {
    User.findOne({userName: req.body.userName}, function(err, user) {
      if(err){
        throw err;
      }
      if (user.validPassword(req.body.password)) {
        var token = generateToken(req.body.userName);
        res.send(token);
      } else {
        console.log('Db password is ', user.password);
        console.log('Passed password is ', user.generateHash(req.body.password));
        res.json({ message: 'Error logging in!'});
      }
    })
  }
}
function generateToken(userName){
  var claims = {
    sub: userName,
    iss: 'docman',
    permissions: 'create'
  }
  var jwt = nJwt.create(claims,'gukuniku');
  var token = jwt.compact();
  return token;
}

module.exports = userCntrl;
