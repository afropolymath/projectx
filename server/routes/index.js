'use strict'

var config = require('../../config'),
  Firebase = require('firebase');

var root = new Firebase(config.FIREBASE_URL);

var Transactions = require('../controllers/transactions.controllers.js')(root);

module.exports = (app) => {
  app.get('/transactions', Transactions.smsRegisterTransaction)
}