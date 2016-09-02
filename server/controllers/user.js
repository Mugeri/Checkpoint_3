require('dotenv').load();
const User = require('./../models/User.js');
const secret = process.env.SECRET;
const nJwt = require('njwt');


const userCntrl = {
  authenticate: function(req, res) {
    // check header or url parameters or post parameters for token
    console.log('before the token', req.headers['x-access-token']);
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token !== undefined) {
      var verified = nJwt.verify(token, secret);
    }
     return res.json({ message: 'Unauthorized User!'})

  },
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
        return res.send(err);
      }
      return res.json({users});
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
        console.log(req.body.userName);
        var token = generateToken(req.body.userName);
        res.send(token);
      } else {
        res.json({ message: 'Error logging in!'});
      }
    })
  },

  logout: function(req, res) {
    console.log('We are here!');
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token) {
      console.log('now we are here!');
      token = '';
      res.send(token);
    } else {
      res.json({ message: 'no token found'})
    }

  }
}
function generateToken(userName){
  var claims = {
    sub: userName,
    iss: 'docman',
    permissions: 'create'
  }
  var jwt = nJwt.create(claims, process.env.SECRET);
  var token = jwt.compact();
  return token;
}

module.exports = userCntrl;
