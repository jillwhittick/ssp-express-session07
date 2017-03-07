var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var admin = require('./routes/admin');

var app = express();

var session = require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var expressSessionOptions = {
  secret:'mySecret',
  resave: false,
  saveUninitialized: false
}

app.use(session(expressSessionOptions));

var jokesSetup = function(req, res, next) {
  if(!req.session.allJokes) {
    req.session.allJokes = new Array();
  }

  if(!req.session.jokesCounter) {
    req.session,jokesCounter = 0;
  }

  next();
}

app.use(jokesSetup);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var loggedIn = function(req, res, next) {
  if(!req.session.username) {
    res.redirect('/login');
  }
  else {
    next();
  }
}

app.use('/admin', loggedIn);
app.use('/admin', admin);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// development
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
