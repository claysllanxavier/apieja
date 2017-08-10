module.exports = function() {
  var controller = {};
  controller.exibeLogin = function(req, res) {
    res.render("login", { message: req.flash('loginMessage') });
  };

  controller.fazLogout = function(req, res) {
    req.logout();
    res.redirect('/login');
  };

  return controller;
}
