module.exports = function (app) {
  var controller = {}
  var Model = app.models.conteudo

  controller.getAll = function (req, res) {
    Model.find()
    .select('conteudo informacao _id')
    .exec()
    .then(function (data) {
      res.json(data)
    },
    function (erro) {
      res.status(500).json(erro)
    })
  }

  controller.getById = function (req, res) {
    var id = req.params.id
    Model.findById(id)
    .select('conteudo informacao _id')
    .exec()
    .then(function (data) {
      res.json(data)
    },
    function (erro) {
      res.status(500).json(erro)
    })
  }

  controller.insert = function (req, res) {
    var data = req.body.data
    Model.create(data)
    .then(function () {
      res.end()
    },
    function (erro) {
      res.status(500).json(erro)
    })
  }

  controller.update = function (req, res) {
    var id = req.params.id
    var data = req.body.data
    Model.update({'_id': id}, {$set: data})
    .then(function () {
      res.end()
    },
    function (erro) {
      res.status(500).json(erro)
    })
  }

  controller.delete = function (req, res) {
    var id = req.params.id
    Model.remove({'_id': id})
    .exec()
    .then(function () {
      res.end()
    },
    function (erro) {
      res.status(500).json(erro)
    })
  }

  return controller
}
