module.exports = function (app) {
  var controller = app.controllers.usuario

  // Usuário
  app.route('/api/usuario')
  .get(controller.getAll)
  .post(controller.insert)

  app.route('/api/usuario/:id')
  .get(controller.getById)
  .delete(controller.delete)
  .put(controller.update)

  app.route('/api/login')
  .post(controller.login)

  app.route('/api/usuario/:idusuario/conteudo/:idconteudo')
  .get(controller.getQuestion)
  .delete(controller.clearQuiz)

  app.route('/api/resposta')
  .post(controller.saveAnswer)

}
