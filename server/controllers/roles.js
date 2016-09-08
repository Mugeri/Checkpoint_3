const Roles = require('./../models/roles.js');
const bodyParser = require('body-parser');
const userCntrl = require('./user.js');


const roleCntrl = {
  createRole: function(req, res) {
    console.log('i\'m here');
    var token = userCntrl.authenticate(req, res);
    var permissions = token.body.permissions;
    console.log('ndio hizi permissions ', permissions);

    if(permissions == 'Admin') {
      console.log('niko hapa');
      Roles.find({ title: req.body.title}, function(err, roles) {
        if(!roles) {
          var role = new Roles();
          role.title = req.body.title;

          role.save(function(err) {
            if(err) {
              return res.send(err);
            }
            return res.json({ message: 'Role created!'});
          });
        } else {
          res.json({ message: 'Role already exists!'});
        }
      });
    } else {
      res.json({ message: 'You dont have permission to do that'});
    }
  },
  all: function(req, res) {
    Roles.find(function(err, roles) {
        if(err) {
          res.send(err);
        }
        return res.json(roles);
      });
  }
}
module.exports = roleCntrl;
