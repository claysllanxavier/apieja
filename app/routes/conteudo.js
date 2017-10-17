module.exports = function(app) {
  var controller = app.controllers.conteudo;

  //Conteúdos
  app.route('/api/conteudo')
  .get(controller.getAll)
  .post(controller.insert);

  app.route('/api/conteudo/:id')
  .get(controller.getById)
  .delete(controller.delete)
  .put(controller.update);

};
