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
      res.status(400).json({ message: 'You dont have permission to do that' });
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
  updateRole: (req, res) => {
    const token = userCntrl.authenticate(req, res);
    if (token.message === 'Unauthorized User!') {
      return res.status(400).json({ message: 'Unauthorized User!' });
    }
    const permissions = token.body.permissions;

    if (permissions === 'Admin') {
      console.log('ID BEING SEARCHED IS: ', req.params.role_id);

      Roles.findById(req.params.role_id, (err, role) => {
        if (err || !role) {
          return res.status(400).json({ message: 'no such role!' });
        }
        // modify the role
        role.title = req.body.title;

        role.save((err) => {
          if (err) {
            return res.status(400).err;
          }
          return res.status(200).json({ message: 'Role documented' });
        });
      });
    }
  },
  deleteRole: (req, res) => {
    const token = userCntrl.authenticate(req, res);
    if (token.message === 'Unauthorized User!') {
      return res.status(400).json({ message: 'Unauthorized User!' });
    }
    Roles.remove({
      _id: req.params.role_id
    }, (err, role) => {
      if (err) {
        return res.status(400).err;
      }
      return res.json({ message: 'Successfully deleted' });
    });
  },
};
module.exports = roleCntrl;
