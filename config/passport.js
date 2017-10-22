var mongoose = require('mongoose')
var passport = require('passport')

module.exports = function () {
  var User = mongoose.model('Admin')

  var LocalStrategy = require('passport-local').Strategy
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'senha',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    User.findOne({ 'email': email }, function (err, user) {
      // if there are any errors, return the error before anything else
      if (err) {
        return done(err)
      }

      // if no user is found, return the message
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Nenhum usuário encontrado!'))
      }
      // if the user is found but the password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Oops! Senha incorreta.')) // create the loginMessage and save it to session as flashdata
      }

      // all is well, return successful user
      return done(null, user)
    })
  }))

  passport.serializeUser(function (usuario, done) {
    done(null, usuario._id)
  })

  passport.deserializeUser(function (id, done) {
    User.findById(id).exec()
    .then(function (usuario) {
      done(null, usuario)
    })
  })
}
