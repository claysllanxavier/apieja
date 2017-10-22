module.exports = function (app) {
  var controller = app.controllers.video

  // Vídeos
  app.route('/api/video/:idconteudo')
  .post(controller.insert)

  app.route('/api/conteudo/:idconteudo/video/:idvideo')
  .get(controller.getById)
  .delete(controller.delete)
  .put(controller.update)

  app.route('/api/conteudo/videos/:id')
  .get(controller.getByConteudo)
}
