const router = require('express').Router();
const roleCntrl = require('../controllers/roles.js');
const userCntrl = require('../controllers/user.js');

{
  // router.use(function(req, res, next) {
  //   //do logging
  //   console.log('Something is happening. ')
  //   userCntrl.authenticate(req, res);
  //   next();
  // });

  router.route('/')
    //create a role
    .post(roleCntrl.createRole)
    .get(roleCntrl.all);

}
module.exports = router;
