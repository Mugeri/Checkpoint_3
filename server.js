// call the packages we need
const express = require('express');
const mongoose = require('mongoose');
const router = require('./server/routes');
const passport = require('passport');
const flash = require('connect-flash');
require('dotenv').load();

const app = express();

const port = process.env.PORT || 8080;

const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// the mpromise is deprecated so had to plugin anothere library
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/docman');

// configure app to use bodyParser()
// this will let us get data from a POST
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser(process.env.SECRET)); // read cookieParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs'); // set up ejs for templating
// REGISTER THE ROUTES
// all of the routes are prefixed with /api
router(app, passport);
// app.use('/api', router);

// START THE server
app.listen(port);
console.log('Magic happens on port ', port);

module.exports = app;
