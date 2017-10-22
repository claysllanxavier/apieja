module.exports = function (app) {
  var controller = {}
  var Model = app.models.conteudo

  controller.getById = function (req, res) {
    var idconteudo = req.params.idconteudo
    if (idconteudo == 1) idconteudo = req.session.idconteudo
    var idvideo = req.params.idvideo
    Model.findById(idconteudo)
    .select('videos _id')
    .exec()
    .then(function (myDocument) {
      let data = {}
      data['_id'] = myDocument._id
      data['video'] = myDocument.videos.id(idvideo)
      res.json(data)
    },
    function (erro) {
      res.status(500).json(erro)
    })
  }

  controller.insert = function (req, res) {
    var url = req.body.data.url
    var idconteudo = req.params.idconteudo
    if (idconteudo == 1) idconteudo = req.session.idconteudo
    // conveter url em um iframe para o app
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    var match = url.match(regExp)
    if (match && match[2].length == 11) {
      url = 'https://www.youtube.com/embed/' + match[2]
    } else {
      res.status(500)
    }
    Model.update({'_id': idconteudo}, {$push: {'videos': {nome: req.body.data.nome, url: url}}}, {safe: true, upsert: true, new: true})
    .then(
      function () {
        res.end()
      },
      function (erro) {
        res.status(500).json(erro)
      })
  }

  controller.update = function (req, res) {

  }

  controller.delete = function (req, res) {
    var idvideo = req.params.idvideo
    var idconteudo = req.params.idconteudo
    if (idconteudo == 1) idconteudo = req.session.idconteudo
    Model.findByIdAndUpdate(idconteudo, {$pull: {videos: {_id: idvideo}}})
      .exec()
      .then(
        function () {
          res.end()
        },
        function (erro) {
          res.status(500).json(erro)
        })
  }

  controller.getByConteudo = function (req, res) {
    var id = req.params.id
    if (id == 1) id = req.session.idconteudo
    Model.findById(id)
        .select('videos _id')
        .exec()
        .then(
          function (data) {
            res.json(data)
          },
          function (erro) {
            res.status(500).json(erro)
          })
  }

  return controller
}
