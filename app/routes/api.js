module.exports = function(app) {
  var controller = app.controllers.api;


  //Vídeos
  app.route('/api/video/:id')
  .get(controller.obtemVideo)
  .post(controller.salvaVideo);

  app.delete('/api/conteudo/:idconteudo/video/:idvideo',controller.removeVideo);
  app.delete('/api/conteudo/:idconteudo/pergunta/:idpergunta',controller.removePergunta);

  app.route('/api/conteudo/videos/:id')
  .get(controller.obtemVideobyConteudo);

  //Conteúdos
  app.route('/api/conteudos')
  .get(controller.listaTodosConteudos)
  .post(controller.salvaConteudo);

  app.route('/api/conteudo/:id')
  .get(controller.obtemConteudoQuiz)
  .delete(controller.removeConteudo)
  .post(controller.salvaConteudo);

  //Quiz
  app.route('/api/pergunta/:id')
  .post(controller.salvaPergunta);

  app.route('/api/pergunta')
  .post(controller.salvaResposta);

  app.get('/api/conteudo/:idconteudo/pergunta/:idusuario', controller.obtemPergunta);

  app.route('/api/conteudo/perguntas/:id')
  .get(controller.obtemPerguntabyConteudo);

  //Usuarios
  app.route('/api/usuarios')
  .get(controller.listaTodosUsuarios)
  .post(controller.salvaUsuario);

  app.route('/api/usuario')
  .post(controller.obtemUsuario);

  app.route('/api/usuario/:idusuario/conteudo/:idconteudo')
  .delete(controller.limparQuiz);


  //Administrador
  app.route('/api/admin')
  .get(controller.listaTodosAdmins)
  .post(controller.salvaAdmin);

  app.route('/api/minhaconta')
  .get(controller.getUsuario)
  .post(controller.editUsuario);

  app.post('/api/minhaconta/senha', controller.mudaSenha);

  //Informação
  app.route('/api/quantidade')
  .get(controller.listaQuantidade)


};
