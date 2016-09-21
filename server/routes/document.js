
const router = require('express').Router();
const documentCntrl = require('../controllers/document');
const userCntrl = require('../controllers/user');


{
  // middleware to use for all requests
  // you can use it to make sure that everything
  // coming from a request is safe. You can even throw errors
  // here.
  router.use((req, res, next) => {
    // do logging
    console.log('Something is happening. ');
    userCntrl.authenticate(req, res);
    next();
  });

  router.route('/')

    // create a document
    .post(documentCntrl.createDoc)
    .get(documentCntrl.all);

  router.route('/:document_id')

    // get the document with that id
    .get(documentCntrl.getSpecificDoc)

    // update the document with given id
    .put(documentCntrl.updateDoc)
    .delete(documentCntrl.deleteDoc);

}
module.exports = router;
