module.exports = function (app) {
  var controller = app.controllers.administrador

  // Administrador
  app.route('/api/admin')
  .get(controller.getAll)
  .post(controller.insert)

  app.route('/api/admin/:id')
  .get(controller.getById)
  .put(controller.update)
  .delete(controller.delete)

  app.post('/api/minhaconta/senha', controller.changePass)
}
