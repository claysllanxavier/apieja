module.exports = function(app) {
  var controller = app.controllers.api;


  //Vídeos
  app.route('/api/videos')
  .get(controller.listaVideos);

  app.route('/api/videos/:id')
  .get(controller.listaVideosPorID);
  //Conteúdos
  app.route('/api/conteudos')
  .get(controller.listaConteudos);
};
