module.exports = function(app) {
  var controller = {};
  var Video = app.models.videos;

  controller.listaVideos = function(req, res) {
    Video.find().exec()
    .then(
      function(videos) {
        res.json(videos);
      },
      function(erro) {
        console.error(erro)
        res.status(500).json(erro);
      }
    );
  };

  return controller;
}
