var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleSchema = new Schema({
  title: String
});

module.exports = mongoose.model('Roles', roleSchema);
