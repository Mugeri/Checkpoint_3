
const express = require('express');
const userCntrl = require('../controllers/user');

const router = express.Router();


{
  /*
  middleware to use for all requests
  you can use it to make sure that everything
  coming from a request is safe. You can even throw errors
  here.
  */
  router.route('/login')
    .post(userCntrl.login);

  router.use((req, res, next) => {
    // do logging
    console.log('Something is happening. ');
    userCntrl.authenticate(req, res);
    next();
  });

 /*
  //test route to make sure everything is working
  // router.get('/', function(req, res) {
  //   res.json({ message: 'Hooray! welcome to my api!'});
  // });
  */
  router.route('/logout')
    .post(userCntrl.logout);

  router.route('/')
    // create a user
    .post(userCntrl.createUser)
    .get(userCntrl.all);

  router.route('/:user_id')
    .get(userCntrl.getSpecificUser)
    .put(userCntrl.updateUser)
    .delete(userCntrl.deleteUser);
}
module.exports = router;
