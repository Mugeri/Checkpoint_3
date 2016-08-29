
const router = require('express').Router();
const documentCntrl = require('../controllers/document.js');


{
  //middleware to use for all requests
  //you can use it to make sure that everything
  //coming from a request is safe. You can even throw errors
  //here.
  router.use(function(req, res, next) {
    //do logging
    console.log('Something is happening. ')
    next();
  });

  router.route('/')

    //create a document
    .post(documentCntrl.createDoc)
    .get(documentCntrl.getAllDocs);

  router.route('/:document_id')

    //get the document with that id
    .get(documentCntrl.getSpecificDoc)

    //update the document with given id
    .put(documentCntrl.updateDoc)
    .delete(documentCntrl.deleteDoc);
}
module.exports = router;
