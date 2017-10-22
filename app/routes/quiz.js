module.exports = function (app) {
  var controller = app.controllers.quiz

  // Quiz
  app.route('/api/pergunta/:id')
  .post(controller.insert)

  app.route('/api/conteudo/:idconteudo/pergunta/:idpergunta')
  .delete(controller.delete)
  .put(controller.update)
  .get(controller.getById)

  app.route('/api/conteudo/perguntas/:id')
  .get(controller.getByConteudo)
}
