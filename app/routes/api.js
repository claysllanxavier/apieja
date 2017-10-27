module.exports = function (app) {
  var controller = app.controllers.api
  // Informação
  app.route('/api/quantidade')
  .get(controller.listaQuantidade)

}
