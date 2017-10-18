var authenticated = require('../../config/auth')
module.exports = function (app) {
  var controller = app.controllers.home
  app.get('/', authenticated, controller.index)
  app.get('/videos/:id', authenticated, controller.redictVideos)
  app.get('/videos', authenticated, controller.listarVideos)
  app.get('/conteudos', authenticated, controller.listarConteudos)
  app.get('/usuarios', authenticated, controller.listarUsuarios)
  app.get('/admin', authenticated, controller.listarAdmins)
  app.get('/quiz/:id', authenticated, controller.redictPerguntas)
  app.get('/quiz', authenticated, controller.listaPerguntas)
  app.get('/minhaconta', authenticated, controller.minhaConta)
}
