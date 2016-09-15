require('dotenv').load();
const User = require('./../models/user');
const nJwt = require('njwt');

const secret = process.env.SECRET;

const userCntrl = {
  authenticate: (req, res) => {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      const verified = nJwt.verify(token, secret);
      return verified;
    }
    return res.status(400).json({ message: 'Unauthorized User!' });
  },
  createUser: (req, res) => {
    const token = userCntrl.authenticate(req, res);
    const permissions = token.body.permissions;

    User.find({ email: req.body.email }, (err, users) => {
      if (!users.length) {
        const user = new User(); // create a new instance of the User models

        user.userName = req.body.userName;
        user.name.first = req.body.firstName;
        user.name.last = req.body.lastName;
        user.email = req.body.email;
        user.password = user.generateHash(req.body.password);
        if (permissions === 'Admin') {
          user.role = req.body.role || 'User';
        } else {
          user.role = 'User';
        }

        // save the user and check for errors
        user.save(() => {
          if (err) {
            res.status(400).json({
              message: 'Something went wrong',
              err,
            });
          } else {
            res.status(200).json({ message: 'User Created', user });
          }
        });
      } else {
        res.status(400).json({ message: 'User already exists' });
      }
    });
  },
  all: (req, res) => {
    User.find((err, users) => {
      if (err) {
        return res.send(err);
      }
      return res.json({
        message: 'all users',
        status: 200,
        users,
      });
    });
  },

  getSpecificUser: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json(user);
    });
  },
  updateUser: (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
      const token = userCntrl.authenticate(req, res);
      const permissions = token.body.permissions;
      if (err) {
        res.send(err);
      }
      if (!user) {
        res.json({ message: 'no such user!' });
      } else {
        // update the user info
        user.userName = req.body.userName;
        user.name.first = req.body.firstName;
        user.name.last = req.body.lastName;
        user.email = req.body.email;
        user.password = user.generateHash(req.body.password);

        if (permissions === 'Admin') {
          user.role = req.body.role;
        } else {
          user.role = 'User';
        }

        user.save(() => {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'User updated!' });
        });
      }
    });
  },

  deleteUser: (req, res) => {
    User.remove({
      _id: req.params.user_id,
    }, (err) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Successfully deleted' });
    });
  },
  login: (req, res) => {
    User.findOne({ userName: req.body.userName }, (err, user) => {
      if (err) {
        res.status(400).json({ err });
      }
      if (user.validPassword(user, req.body.password)) {
        const token = generateToken(user.userName, user.role);

        res.status(200).json({ message: 'logged in!',
                  token,
                });
      } else {
        res.status(400).json({ message: 'Error logging in!' });
      }
    });
  },

  logout: (req, res) => {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      token = '';
      res.send({ token });
    } else {
      res.json({ message: 'no token found' });
    }
  },
};

/*
 * generate a token once a user logs in
 */
function generateToken(userName, role) {
  const claims = {
    sub: userName,
    iss: 'docman',
    permissions: role,
  };
  const jwt = nJwt.create(claims, process.env.SECRET);
  const token = jwt.compact();
  return token;
}

module.exports = userCntrl;
