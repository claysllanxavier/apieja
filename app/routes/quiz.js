module.exports = function (app) {
  var controller = app.controllers.quiz

  // Quiz
  app.route('/api/conteudo/:idconteudo/pergunta')
  .post(controller.insert)
  .get(controller.getByConteudo)

  app.route('/api/conteudo/:idconteudo/pergunta/:idpergunta')
  .delete(controller.delete)
  .put(controller.update)
  .get(controller.getById)

}
