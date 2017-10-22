module.exports = function (app) {
  var controller = {}
  var Model = app.models.conteudo

  controller.getById = function (req, res) {
    var idconteudo = req.params.idconteudo
    if (idconteudo == 1) idconteudo = req.session.idconteudo
    var idpergunta = req.params.idpergunta
    Model.findById(idconteudo)
    .select('perguntas _id')
    .exec()
    .then(function (myDocument) {
      let data = {}
      data['_id'] = myDocument._id
      data['pergunta'] = myDocument.perguntas.id(idpergunta)
      res.json(data)
    },
    function (erro) {
      res.status(500).json(erro)
    })
  }

  controller.insert = function (req, res) {
    var idconteudo = req.params.id
    if (idconteudo == 1) idconteudo = req.session.idconteudo
    Model.update({'_id': idconteudo}, {$push: {'perguntas': req.body.data}}, {safe: true, upsert: true, new: true})
    .then(
      function () {
        res.end()
      },
      function (erro) {
        res.status(500).json(erro)
      })
    }

    controller.update = function (req, res) {
      var idconteudo = req.params.idconteudo
      if (idconteudo == 1) idconteudo = req.session.idconteudo
      var idpergunta = req.params.idpergunta
      Model.findById(idconteudo)
      .select('perguntas _id')
      .exec()
      .then(function (myDocument) {
        let item =  myDocument.perguntas.id(idpergunta)
        item.pergunta = req.body.data.pergunta
        item.respostas = req.body.data.respostas
        item.respostaCerta = req.body.data.respostaCerta
        myDocument.save(function (err) {
          if (err) { res.status(500).json(err) }
          res.end()
        });
      },
      function (erro) {
        res.status(500).json(erro)
      })
    }

    controller.delete = function (req, res) {
      var idpergunta = req.params.idpergunta
      var idconteudo = req.params.idconteudo
      if (idconteudo == 1) idconteudo = req.session.idconteudo
      Model.findByIdAndUpdate(idconteudo, {$pull: {perguntas: {_id: idpergunta}}})
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
        .select('perguntas _id')
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
