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

    if( permissions == 'Admin' ) {
      document.Permissions = req.body.permissions || 'Public';
      document.Owner = req.body.owner;
    } else {
      document.Permissions = 'Public';
      document.Owner = owner;
    }

    //save the document and check for errors
    document.save(function(err) {
      if(err) {
        return res.status(400).json({ message: err });
      }
      return res.status(200).json({
        message: 'Document created!',
        document: document
        });
    });
  },
  all: function(req, res) {
    var token = userCntrl.authenticate(req, res);
    var permissions = token.body.permissions || req.body.role || req.query.role || req.headers['role'];
    var owner = token.body.sub;
    var limit = req.body.limit || req.query.limit || req.headers['limit'];
    var page = req.body.page || req.query.page || req.headers['page'];
    var published = req.body.published || req.query.published || req.headers['published'];

    if(permissions == 'Admin'){
      if(published) {
<<<<<<< HEAD
        var start = new Date(published);
        var end = new Date(start.getTime() + 86400000);

=======
        var start = published + 'T00:00:00Z';
        var end = published + 'T23:59:59Z';
>>>>>>> 60d43e6179c1eb3d88146354cbffb52e387eadad
        var query = Document.find({CreatedAt: {"$gte": start, "$lt": end}});
      }
      query = Document.find();
    } else {
      if(published){
<<<<<<< HEAD
        var start = new Date(published);
        var end = new Date(start.getTime() + 86400000);

        console.log('TUNATAFUTA KUTOKA: ', start);
        console.log('MPAKA: ', end);

        var query = Document.find(
          { $and: [{ CreatedAt: {"$gte": start, "$lt": end}},
=======
        var start = published + 'T00:00:00Z';
        var end = published + 'T23:59:59Z';
        var query = Document.find(
          { $and: [{ CreatedAt: {"$gte": start, "$lt": end} },
>>>>>>> 60d43e6179c1eb3d88146354cbffb52e387eadad
            {$or:[{ Owner: owner}, {Permissions: 'Public' }]}
          ]
          });
      } else {
        var query = Document.find(
          { $or: [{Owner: owner}, {Permissions: 'Public'}]
        });
      }
    }
<<<<<<< HEAD
    Document.paginate(query.sort('-CreatedAt'),
    { page: parseInt(page), limit: parseInt(limit)})
      .then(function(err, documents) {
      if(err) {
        return res.status(400).json({ message: err });
=======
    Document.paginate(query.sort('CreatedAt'),
    { page: parseInt(page), limit: parseInt(limit)})
      .then(function(err, documents) {
      if(err) {
        res.send(err);
>>>>>>> 60d43e6179c1eb3d88146354cbffb52e387eadad
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
