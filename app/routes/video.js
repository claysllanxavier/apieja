module.exports = function (app) {
  var controller = app.controllers.video

  // Vídeos
  app.route('/api/conteudo/:idconteudo/video')
  .post(controller.insert)
  .get(controller.getByConteudo)

  app.route('/api/conteudo/:idconteudo/video/:idvideo')
  .get(controller.getById)
  .delete(controller.delete)
  .put(controller.update)

}
