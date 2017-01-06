//adding opensource modules to application
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var mongoose = require('mongoose');
var models_user = require('./angular/models/user.js');
var models_carrier = require('./angular/models/carrier.js');
var x2js = require('x2js');
var escape = require('escape-html');
//connection database
//mongoose.connect('mongodb://remote:MiltonKeynes@ec2-54-197-83-74.compute-1.amazonaws.com:27017/gofaseterapp');
//'mongodb://{NEW USERNAME}:{NEW PASSWORD}@{EC2 URL}:{PORT}/dummyDB'
mongoose.connect('mongodb://gofasterapp:prodinstance@ec2-35-167-79-162.us-west-2.compute.amazonaws.com:27017/gofaseterdb');

//import the routers
var router = require('./routes/router');
var authenticate = require('./routes/authentication')(passport);

//for using express throughout this application
var app = express();
//tell node that My application will use ejs engine for rendering, view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//tell node the global configuration about parser,logger and passport
app.use(cookieParser());
app.use(logger('dev'));
app.use(session({
  secret: 'keyboard cat'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize()); //initializing passport
app.use(passport.session()); //initializing passport session

//tell node about these directories that application may get resources from
app.use('/', router);
app.use('/auth', authenticate);
// app.use(express.static(path.join(__dirname, 'scripts')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'Content')));
app.use(express.static(path.join(__dirname, 'angular')));
app.use(express.static(path.join(__dirname, 'views/pages')));
app.use(express.static(path.join(__dirname, 'views/authentication')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-ui-bootstrap/dist/'));
app.use('/scripts1', express.static(__dirname + '/node_modules/vsGoogleAutocomplete/dist/'));
app.use('/scripts2', express.static(__dirname + '/node_modules/angular-smart-table/dist/'));
app.use('/scripts4', express.static(__dirname + '/node_modules/ng-file-upload/dist/'));

//providing auth-api to passport so that it can use it.
var initPassport = require('./passport/passport-init');
initPassport(passport);


//running server on node
// var server = app.listen(3000, function () {
//   var host = server.address().address;
//   var port = server.address().port;
//   console.log('Example app listening at http://', host, port);
// });
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//exporting this application as a module
module.exports = app;
