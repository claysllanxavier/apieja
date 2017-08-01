module.exports = function() {
  var controller = {};
  controller.exibeLogin = function(req, res) {
    res.render("login");
  };

  controller.realizaLogin = function(req, res) {};
  
  return controller;
}
