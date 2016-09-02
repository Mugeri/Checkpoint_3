//call the packages we need
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = require('./server/routes');
const port = process.env.PORT || 8080;
const passport = require('passport');
const flash = require('connect-flash');
require('dotenv').load();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session =require('express-session');

mongoose.connect('mongodb://localhost/docman');

// configure app to use bodyParser()
//this will let us get data from a POST
app.use(morgan('dev')); //log every request to the console
app.use(cookieParser(process.env.SECRET)); //read cookieParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session());
app.use(passport.initialize());
app.use(passport.session()); //persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session



app.set('view engine', 'ejs'); //set up ejs for templating
//REGISTER THE ROUTES
//all of the routes are prefixed with /api
router(app, passport);
// app.use('/api', router);

//START THE server
app.listen(port);
console.log('Magic happens on port ' + port);
