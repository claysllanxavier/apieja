module.exports = function(app) {
  var controller = {};
  var Conteudo = app.models.videos;

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
