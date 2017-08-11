module.exports = function(app) {
  var controller = app.controllers.api;


  //Vídeos
  app.route('/api/videos')
  .get(controller.listaTodosVideos)
  .post(controller.salvaVideo);

  app.route('/api/videos/:id')
  .get(controller.obtemVideo);

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
