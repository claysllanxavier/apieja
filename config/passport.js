var mongoose = require('mongoose');
var passport = require('passport');

module.exports = function() {
  var User = mongoose.model('Admin');

  var LocalStrategy   = require('passport-local').Strategy;
  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'senha',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    User.findOne({ 'local.email' :  email }, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err)
      return done(err);
      console.log("Erro no login");

      // if no user is found, return the message
      if (!user)
      return done(null, false); // req.flash is the way to set flashdata using connect-flash
      console.log("Usuário não econtrado!");

      // if the user is found but the password is wrong
      if (!user.validPassword(password))
      return done(null, false); // create the loginMessage and save it to session as flashdata
      console.log("Senha incorreta!");

      // all is well, return successful user
      return done(null, user);
    });

  }));

  passport.serializeUser(function(usuario, done) {
    done(null, usuario._id);
  });

  passport.deserializeUser(function(id, done) {
    Usuario.findById(id).exec()
    .then(function(usuario) {
      done(null, usuario);
    });
  });


};
