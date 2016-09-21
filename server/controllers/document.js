const Document = require('./../models/document');
const User = require('./../models/user');
const userCntrl = require('./user');

const documentCntrl = {
  createDoc: (req, res) => {
    const token = userCntrl.authenticate(req, res);
    if (token.message === 'Unauthorized User!') {
      return res.status(400).json({ message: 'Unauthorized User!' });
    }
    const permissions = token.body.permissions;
    const owner = token.body.sub;
    const document = new Document(); // create a new instance of the Document
    document.Title = req.body.title;
    document.Content = req.body.content;

    if (permissions === 'Admin') {
      document.Permissions = req.body.permissions || 'Public';
      document.Owner = req.body.owner;
    } else {
      document.Permissions = 'Public';
      document.Owner = owner;
    }

    // save the document and check for errors
    document.save((err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      return res.status(200).json({
        message: 'Document created!',
        document,
      });
    });
  },
  all: (req, res) => {
    const token = userCntrl.authenticate(req, res);
    if (token.message === 'Unauthorized User!') {
      return res.status(400).json({ message: 'Unauthorized User!' });
    }
    const permissions = token.body.permissions;
    const owner = token.body.sub;
    const limit = req.body.limit || req.query.limit || req.headers.limit;
    const page = req.body.page || req.query.page || req.headers.page;
    const published = req.body.published || req.query.published || req.headers.published;
    let query;

    if (permissions === 'Admin') {
      if (published) {
        const start = new Date(published);
        const end = new Date(start.getTime() + 86400000);

        query = Document.find({ CreatedAt: { $gte: start, $lt: end } });
      }
      query = Document.find();
    } else if (published) {
      const start = new Date(published);
      const end = new Date(start.getTime() + 86400000);

      query = Document.find(
        { $and: [{ CreatedAt: { $gte: start, $lt: end } },
          { $or: [{ Owner: owner }, { Permissions: 'Public' }] }],
        });
    } else {
      query = Document.find(
        { $or: [{ Owner: owner }, { Permissions: 'Public' }],
      });
    }
    Document.paginate(query.sort('-CreatedAt'),
    { page: parseInt(page, 10), limit: parseInt(limit, 10) })
      .then((err, documents) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
      });
  },
  getSpecificDoc: (req, res) => {
    Document.findById(req.params.document_id, (err, document) => {
      if (err) {
        return res.status(400).err;
      }
      return res.json(document);
    });
  },
  getUserDoc: (req, res) => {
    const token = userCntrl.authenticate(req, res);
    if (token.message === 'Unauthorized User!') {
      return res.status(400).json({ message: 'Unauthorized User!' });
    }
    User.findById(req.params.user_id, (err, user) => {
      if (err) {
        return res.status(400).err;
      }
      Document.find({ Owner: user.userName }, (err, documents) => {
        if (err) {
          return res.status(400).err;
        }
        return res.status(200).json({ documents });
      });
    });
  },
  updateDoc: (req, res) => {
    const token = userCntrl.authenticate(req, res);
    if (token.message === 'Unauthorized User!') {
      return res.status(400).json({ message: 'Unauthorized User!' });
    }
    const permissions = token.body.permissions;
    const owner = token.body.sub;

    Document.findById(req.params.document_id, (err, document) => {
      if (err || !document) {
        return res.status(400).json({ message: 'no such document!', err });
      }
      if (owner !== document.Owner) {
        return res.json({ message: 'Cannot edit this document!' });
      }
      // update the document info
      document.Title = req.body.title;
      document.Content = req.body.content;
      document.Owner = owner;
      document.ModifiedAt = Date.now();
      if (permissions === 'Admin') {
        document.Permissions = req.body.permissions;
      } else {
        document.Permissions = 'Public';
      }

      document.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json({ message: 'Document updated!' });
      });
    });
  },
  deleteDoc: (req, res) => {
    const token = userCntrl.authenticate(req, res);
    if (token.message === 'Unauthorized User!') {
      return res.status(400).json({ message: 'Unauthorized User!' });
    }
    Document.remove({
      _id: req.params.document_id,
    }, (err, user) => {
      if (err) {
        return res.err;
      }
      res.json({ message: 'Successfully deleted' });
    });
  },
};

module.exports = documentCntrl;
