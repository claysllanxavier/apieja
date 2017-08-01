module.exports = function() {
  var controller = {};
  controller.exibeLogin = function(req, res) {
    res.render("login");
  };
    
  return controller;
}
