var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var documentSchema = new Schema({
  Title: String,
  Content: String,
  Owner: String,
  CreatedAt: Date,
  ModifiedAt: Date
});
module.exports = mongoose.model('Document', documentSchema);
