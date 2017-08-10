module.exports = function() {
  var controller = {};
  controller.exibeLogin = function(req, res) {
    res.render("login", { message: req.flash('loginMessage') });
  };

  controller.fazLogout = function(req, res) {
    req.logout();
    res.redirect('/login');
  };


  controller.exibeEsqueci = function(req, res) {
    res.render("forgot-password");
  };

  return controller;
}
