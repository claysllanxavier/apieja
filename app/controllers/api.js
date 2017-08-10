module.exports = function(app) {
  var controller = {};
  var Conteudo = app.models.videos;

//Vídeos
  controller.listaVideos = function(req, res) {
    Conteudo.find().exec()
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

  controller.listaVideosPorID = function(req, res) {
    var id = req.params.id;
    Conteudo.findById(id).exec()
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

//Conteudo
  controller.listaConteudos = function(req, res) {
    Conteudo.find({}, 'conteudo informacao _id').exec()
    .then(
      function(conteudos) {
        res.json(conteudos);
      },
      function(erro) {
        console.error(erro)
        res.status(500).json(erro);
      }
    );
  };

  return controller;
}
