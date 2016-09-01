const Document = require('./../models/document.js');
const bodyParser = require('body-parser');

const documentCntrl = {
  createDoc: function(req, res) {
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
  },
  getAllDocs: function(req, res) {
    Document.paginate(
      Document.find(function(err, documents) {
        if(err) {
          res.send(err);
        }
        res.json(documents);
      }),{ offset: 10, limit: 10 },(function(err, documents) {
        if(err) {
          res.send(err);
        }
        // res.json(documents);
      }));
  },
  getSpecificDoc: function(req, res) {
    Document.findById(req.params.document_id, function(err, document) {
      if(err){
        res.send(err);
      }
      res.json(document);
    });
  },
  updateDoc: function(req, res) {

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
  },
  deleteDoc: function(req, res) {
    Document.remove({
      _id: req.params.document_id
    }, function(err, user) {
      if(err) {
        res.send(err);
      }
      res.json({ message: 'Successfully deleted' });
    });
  }
}
module.exports = documentCntrl;
