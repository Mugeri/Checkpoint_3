//call the packages we need
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const router = require('./server/routes/routes.js');
const Document = require('./server/models/documents.js');
const User = require('./server/models/User.js');
const Roles = require('./server/models/roles.js');


// configure app to use bodyParser()
//this will let us get data from a POST

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

//REGISTER THE ROUTES
//all of the routes are prefixed with /api
app.use('/api', router);

//START THE server
app.listen(port);
console.log('Magic happens on port ' + port);
mongoose.connect('mongodb://localhost/docman');
