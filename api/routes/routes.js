'use strict';
module.exports = function(app) {
  var uiController = require('../controllers/uiController');

  // USER ROUTES
  app.route('/login').post(uiController.login);
  app.route('/register').post(uiController.register);
  
  // TRANSACTION ROUTES
  app.route('/purchase').post(uiController.purchase);
  app.route('/sell').post(uiController.sell);

  // WALLET ROUTES
  app.route('/walletContent').post(uiController.walletContent);
  app.route('/depositToWallet').post(uiController.depositToWallet);
  app.route('/withdrawnFromWallet').post(uiController.withdrawnFromWallet);

  //CHARTS AND STATS ROUTES
  app.route('/last').get(uiController.getLastValues);

  //PURCHASE TRIGGERS
  app.route('/purchase-trigger').post(uiController.purchaseTrigger);

};
