'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('error-handler'),
    morgan = require('morgan'),
    path = require('path'),
    _ = require('lodash'),
    config = require('./config'),
    Firebase = require('firebase');

var app = express();

var rootRef = new Firebase('https://projectexe.firebaseio.com/');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express['static'](path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

var root = new Firebase(config.FIREBASE_URL);

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/registertransaction', function (req, res) {
  // transactionId = root.child('transactions');
  // snapId = root.child('messages').push(req.query, function(err) {
  //   if(!err) {
  //     // parse message
  //   }
  // });
  // Message format
  if (req.query && !_.isEmpty(req.query)) {
    message = req.query.text;
    // compare message to message format
    // extract valuable information
    // search the transactions table based on that
    // add message where necessary
    rootRef.child('messages').push(req.query, function (err) {
      res.json(req.query);
    });
  } else {
    res.json({ 'status': 'Invalid Request' });
  }
});

var messageParser = function messageParser(message) {
  var valid = false;
};

var server = app.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Express server listening on port " + port);
});