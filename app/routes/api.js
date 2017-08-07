module.exports = function(app) {
  var controller = app.controllers.api;
  app.route('/api/videos')
  .get(controller.listaVideos);
};
