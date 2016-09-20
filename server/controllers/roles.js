const Roles = require('./../models/roles');
const userCntrl = require('./user');


const roleCntrl = {
  createRole: (req, res) => {
    const token = userCntrl.authenticate(req, res);
    if (token.message === 'Unauthorized User!') {
      return res.status(400).json({ message: 'Unauthorized User!' });
    }
    const permissions = token.body.permissions;

    if (permissions === 'Admin') {
      Roles.find({ title: req.body.title }, (err, roles) => {
        if (!roles.length) {
          const role = new Roles();
          role.title = req.body.title;

          role.save((err) => {
            if (err) {
              return res.send(err);
            }
            return res.json({ message: 'Role created!' });
          });
        } else {
          res.status(400).json({ message: 'Role already exists!' });
        }
      });
    } else {
      res.json({ message: 'You dont have permission to do that' });
    }
  },
  all: (req, res) => {
    Roles.find((err, roles) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      return res.json(roles);
    });
  },
};
module.exports = roleCntrl;
