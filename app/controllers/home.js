module.exports = function() {
  var controller = {};
  controller.index = function(req, res) {
    res.render('index');
  };

  controller.listarVideos = function(req, res) {
    res.render('videos');
  };

  return controller;
}
