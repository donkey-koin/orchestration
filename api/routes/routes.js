'use strict';
module.exports = function(app) {
  var uiController = require('../controllers/uiController');

  app.route('/login').post(uiController.login);
  app.route('/register').post(uiController.register);
  app.route('/purchase').post(uiController.purchase);
  app.route('/walletContent').post(uiController.walletContent);

};
