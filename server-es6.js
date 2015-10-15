'use strict'

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('error-handler'),
  morgan = require('morgan'),
  path = require('path'),
  config = require('./config'),
  Firebase = require('firebase');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';

var routes = require('./server/routes');

routes(app);

app.get('/*', (req, res) => {
  res.render('index');
});

let server = app.listen(process.env.PORT || 3000, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log("Express server listening on port " + port);
});
