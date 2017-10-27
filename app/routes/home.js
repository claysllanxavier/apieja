var authenticated = require('../../config/auth')
module.exports = function (app) {
  var controller = app.controllers.home
  app.get('/', authenticated, controller.index)
  app.get('/api/home', authenticated, controller.gettoken)
}
