'use strict';
module.exports = function(app) {
  var uiController = require('../controllers/uiController');

  app.route('/login')
    .post(uiController.login)

};
