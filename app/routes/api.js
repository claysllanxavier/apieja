module.exports = function (app) {
  var controller = app.controllers.api

  // Quiz
  app.route('/api/pergunta/:id')
  .post(controller.salvaPergunta)

  app.route('/api/pergunta')
  .post(controller.salvaResposta)

  app.get('/api/conteudo/:idconteudo/pergunta/:idusuario', controller.obtemPergunta)
  app.delete('/api/conteudo/:idconteudo/pergunta/:idpergunta', controller.removePergunta)

  app.route('/api/conteudo/perguntas/:id')
  .get(controller.obtemPerguntabyConteudo)

  // Usuarios
  app.route('/api/usuarios')
  .get(controller.listaTodosUsuarios)
  .post(controller.salvaUsuario)

  app.route('/api/usuario')
  .post(controller.obtemUsuario)

  app.route('/api/usuario/:idusuario/conteudo/:idconteudo')
  .delete(controller.limparQuiz)

  // Informação
  app.route('/api/quantidade')
  .get(controller.listaQuantidade)
}
