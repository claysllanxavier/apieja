var passport = require('passport')

module.exports = function (app) {
  var controller = app.controllers.admin
  app.route('/login')
  .get(controller.exibeLogin)
  .post(passport.authenticate('local-login', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }))

  app.get('/logout', controller.fazLogout)
  app.route('/esqueciminhasenha')
    .get(controller.exibeEsqueci)
}
