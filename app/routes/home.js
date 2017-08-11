var authenticated = require('../../config/auth');
module.exports = function(app) {
  var controller = app.controllers.home;
  app.get('/' , authenticated , controller.index);
  app.get('/videos/:id' , authenticated , controller.redictVideos);
  app.get('/videos' , authenticated , controller.listarVideos);
  app.get('/conteudos' , authenticated , controller.listarConteudos);
};
