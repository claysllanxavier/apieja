module.exports = function (app) {
  var controller = app.controllers.api



  // Usuarios
  app.route('/api/usuarios')
  .get(controller.listaTodosUsuarios)
  .post(controller.salvaUsuario)

  app.route('/api/usuario')
  .post(controller.obtemUsuario)

  app.route('/api/usuario/:idusuario/conteudo/:idconteudo')
  .get(controller.obtemPergunta)
  .delete(controller.limparQuiz)

  app.route('/api/pergunta')
  .post(controller.salvaResposta)


  // Informação
  app.route('/api/quantidade')
  .get(controller.listaQuantidade)

}
