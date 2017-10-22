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

  app.route('/api/minhaconta')
  .get(controller.getUser)
  .put(controller.changePass)
}
