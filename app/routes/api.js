module.exports = function(app) {
  var controller = app.controllers.api;


  //Vídeos
  app.route('/api/videos')
  .get(controller.listaVideos);


  //Conteúdos
  app.route('/api/conteudos')
  .get(controller.listaConteudos);
};
