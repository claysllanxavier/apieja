module.exports = function(app) {
  var controller = app.controllers.api;


  //Vídeos
  app.route('/api/videos')
  .get(controller.listaTodosVideos);

  app.route('/api/video/:id')
  .get(controller.obtemVideo)
  .post(controller.salvaVideo);

  app.delete('/api/conteudo/:idconteudo/video/:idvideo',controller.removeVideo);

  app.route('/api/conteudo/videos/:id')
  .get(controller.obtemVideobyConteudo);

  //Conteúdos
  app.route('/api/conteudos')
  .get(controller.listaTodosConteudos)
  .post(controller.salvaConteudo);

  app.route('/api/conteudo/:id')
  .delete(controller.removeConteudo)
  .post(controller.salvaConteudo);

  //Quiz
  app.route('/api/perguntas')
  .get(controller.listaTodasPerguntas)
  .post(controller.salvaPergunta);

  app.route('/api/pergunta/:id')
  .delete(controller.removePergunta)
  .post(controller.salvaPergunta);

  app.route('/api/pergunta')
  .get(controller.obtemPergunta)
  .post(controller.salvaResposta);


  //Usuarios
  app.route('/api/usuarios')
  .get(controller.listaTodosUsuarios)
  .post(controller.salvaUsuario);

  app.route('/api/usuario')
  .post(controller.obtemUsuario);

  app.get('/api/usuario/:id',controller.mostraRespostas);

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
