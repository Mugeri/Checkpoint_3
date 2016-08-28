var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var documentSchema = new Schema({
  Title: String,
  Content: String,
  Owner: String,
  CreatedAt: {type: Date, default: Date.now },
  ModifiedAt: {type: Date, default: Date.now }
});
module.exports = mongoose.model('Document', documentSchema);
