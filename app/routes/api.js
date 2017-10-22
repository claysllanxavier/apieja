module.exports = function (app) {
  var controller = app.controllers.api



  // Usuarios
  app.route('/api/usuarios')
  .get(controller.listaTodosUsuarios)
  .post(controller.salvaUsuario)

  app.route('/api/usuario')
  .post(controller.obtemUsuario)

  app.route('/api/usuario/:idusuario/conteudo/:idconteudo')
  .delete(controller.limparQuiz)

  app.route('/api/pergunta')
  .post(controller.salvaResposta)

  app.get('/api/conteudo/:idconteudo/pergunta/:idusuario', controller.obtemPergunta)


  // Informação
  app.route('/api/quantidade')
  .get(controller.listaQuantidade)

}
