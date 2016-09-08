const Document = require('./../models/document.js');
const bodyParser = require('body-parser');
const userCntrl = require('./user.js');

const documentCntrl = {
  createDoc: function(req, res) {
    var token = userCntrl.authenticate(req, res);
    var permissions = token.body.permissions;
    var owner = token.body.sub;
    var document = new Document(); //create a new instance of the Document
    document.Title= req.body.title;
    document.Content = req.body.content;
    document.Owner = owner;

    if( permissions == 'Admin' ) {
      document.Permissions = req.body.permissions;
    } else {
      document.Permissions = 'Public'
    }

    //save the document and check for errors
    document.save(function(err) {
      if(err) {
        return res.send(err);
      }
      return res.json({ message: 'Document created!' });
    });
  },
  all: function(req, res) {
    var token = userCntrl.authenticate(req, res);
    var permissions = token.body.permissions;
    var owner = token.body.sub;
    var limit = req.body.limit || req.query.limit || req.headers['limit'];
    var page = req.body.page || req.query.page || req.headers['page'];
    var role = req.body.role || req.query.role || req.headers['role'];
    if(permissions == 'Admin'){
      Document.paginate(Document.find().sort('CreatedAt'),
      { page: parseInt(page), limit: parseInt(limit)})
        .then(function(err, documents) {
        if(err) {
          res.send(err);
        }
      });
    }
    Document.paginate(
      Document.find({$or: [{ Owner: owner}, {Permissions: 'Public' }]}),
      { page: parseInt(page), limit: parseInt(limit) })
      .then(function(err, documents) {
        if(err) {
          res.send(err);
        }
    });
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
    var token = userCntrl.authenticate(req, res);
    var permissions = token.body.permissions;
    var owner = token.body.sub;

    Document.findById(req.params.document_id, function(err, document) {
      if(err) {
        res.send(err);
      }
      if(owner !== document.Owner){
        res.json({ message: 'Cannot edit this document!'});
      } else {
      //update the document info
      document.Title= req.body.title;
      document.Content = req.body.content;
      document.Owner = owner;
      document.ModifiedAt = Date.now();
      if( permissions == 'Admin' ) {
        document.Permissions = req.body.permissions;
      } else {
        document.Permissions = 'Public'
      }

      document.save(function(err) {
        if(err) {
          res.send(err);
        }
        res.json({ message: 'Document updated!'});
      });
    }
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
