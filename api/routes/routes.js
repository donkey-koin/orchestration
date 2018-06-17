'use strict';
module.exports = function(app) {
  var uiController = require('../controllers/uiController');

  // USER ROUTES
  app.route('/login').post(uiController.login);
  app.route('/register').post(uiController.register);
  app.route('/getUserData').get(uiController.getUserData);

  // TRANSACTION ROUTES
  app.route('/purchase').post(uiController.purchase);
  app.route('/sell').post(uiController.sell);

  // WALLET ROUTES
  app.route('/walletContent').post(uiController.walletContent);
  app.route('/depositToWallet').post(uiController.depositToWallet);
  app.route('/withdrawnFromWallet').post(uiController.withdrawnFromWallet);

  //CHARTS AND STATS ROUTES
  app.route('/last').get(uiController.getLastValues);

  //PURCHASE TRIGGERS ROUTES
  app.route('/purchase-trigger').post(uiController.purchaseTrigger);


  //BITCOIN TRANSACTION ROUTES
  app.route('/blockchain').get(uiController.getTransactions);
};
