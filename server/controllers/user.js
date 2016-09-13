require('dotenv').load();
const User = require('./../models/User.js');
const secret = process.env.SECRET;
const nJwt = require('njwt');


const userCntrl = {
  authenticate: function(req, res) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      var verified = nJwt.verify(token, secret);
      return verified;
    } else {
      return res.json({ message: 'Unauthorized User!'});

    }
  },
  createUser: function(req, res) {
    var token = userCntrl.authenticate(req, res);
    var permissions = token.body.permissions;

    User.find({email: req.body.email }, function(err, users) {
      if(users.length == 0) {
        var user = new User(); //create a new instance of the User models
        user.userName = req.body.userName;
        user.name.first = req.body.firstName;
        user.name.last = req.body.lastName;
        user.email = req.body.email;
        user.password = user.generateHash(req.body.password);
        if(permissions == 'Admin'){
          user.role = req.body.role;
        } else {
          user.role = 'User';
        }

        //save the user and check for errors
        user.save(function(err) {
          if(err) {
            res.send(err);
          } else{
            res.json({ message: 'User created!',
                      userRole: user.role});
          }
        });
      } else {
        console.log(user);
        res.json({ message: 'User already exists',
                  status: 400});
      }
    });

  },
  getAllUsers: function(req, res) {
    User.find(function(err, users) {
      if(err) {
        return res.send(err);
      }
      return res.json(users);
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
      if(!user) {
        res.json({message: 'no such user!'});
      } else {
        //update the user info
        user.userName = req.body.userName;
        user.name.first = req.body.firstName;
        user.name.last = req.body.lastName;
        user.email = req.body.email;
        user.password = user.generateHash(req.body.password);

        if(permissions == 'Admin'){
          user.role = req.body.role;
        } else {
          user.role = 'User';
        }

        user.save(function(err) {
          if(err) {
            res.send(err);
          }
          res.json({ message: 'User updated!'});
        });
      }

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
        var token = generateToken(user.userName, user.role);
        // res.send(token);
        res.json({ message: 'Error logging in!',
                  status: 200,
                  token: token})
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
      res.send({'token': token});
    } else {
      res.json({ message: 'no token found'})
    }

  }
}
function generateToken(userName, role){
  var claims = {
    sub: userName,
    iss: 'docman',
    permissions: role
  }
  var jwt = nJwt.create(claims, process.env.SECRET);
  var token = jwt.compact();
  return token;
}

module.exports = userCntrl;
