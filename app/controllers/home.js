module.exports = function() {
  var controller = {};
  controller.index = function(req, res) {
    res.json({nome : "Claysllan Xavier"});
  };

  return controller;
}
