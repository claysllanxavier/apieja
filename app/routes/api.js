module.exports = function(app) {
  var controller = app.controllers.api;


  //Vídeos
  app.route('/api/videos')
  .get(controller.listaTodosVideos);

  app.route('/api/video/:id')
  .get(controller.obtemVideo)
  .post(controller.salvaVideo)
  .delete(controller.removeVideo);

  app.route('/api/conteudo/videos/:id')
  .get(controller.obtemVideobyConteudo);

  //Conteúdos
  app.route('/api/conteudos')
  .get(controller.listaTodosConteudos)
  .post(controller.salvaConteudo);

  app.route('/api/conteudo/:id')
  .delete(controller.removeConteudo)
  .post(controller.salvaConteudo);

};
