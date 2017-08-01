module.exports = function(app) {
  var controller = app.controllers.admin;
  app.route('/login')
  .get(controller.exibeLogin)
  .post(controller.realizaLogin)

  };
