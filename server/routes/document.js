
const router = require('express').Router();
const Document = require('./../models/document.js');

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
    .post(function(req, res) {
      var document = new Document(); //create a new instance of the Document
      document.Title= req.body.title;
      document.Content = req.body.content;
      document.Owner = req.body.owner;

      //save the document and check for errors
      document.save(function(err) {
        if(err) {
          res.send(err);
        }
        res.json({ message: 'Document created!' });
      });
    })
    .get(function(req, res) {
      Document.find(function(err, documents) {
        if(err) {
          res.send(err);
        }
        res.json(documents);
      });
    });

  router.route('/:document_id')

    //get the document with that id
    .get(function(req, res) {
      Document.findById(req.params.document_id, function(err, document) {
        if(err){
          res.send(err);
        }
        res.json(document);
      });
    })

    //update the document with given id
    .put(function(req, res) {

      Document.findById(req.params.document_id, function(err, document) {
        if(err) {
          res.send(err);
        }
        //update the document info
        document.Title= req.body.title;
        document.Content = req.body.content;
        document.Owner = req.body.owner
        document.ModifiedAt = Date.now();

        document.save(function(err) {
          if(err) {
            res.send(err);
          }
          res.json({ message: 'Document updated!'});
        });
      });
    })
    .delete(function(req, res) {
      Document.remove({
        _id: req.params.document_id
      }, function(err, user) {
        if(err) {
          res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
      });
    });
}
module.exports = router;
