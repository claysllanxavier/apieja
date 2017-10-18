var bcrypt = require('bcrypt-nodejs')
module.exports = function (app) {
  var controller = {}
  var Model = app.models.admin

  // Administradores
  controller.getAll = function (req, res) {
    Model.find()
    .exec()
    .then(
      function (data) {
        res.json(data)
      },
      function (erro) {
        res.status(500).json(erro)
      })
  }

  controller.insert = function (req, res) {
    req.body.senha = bcrypt.hashSync(req.body.senha, bcrypt.genSaltSync(8), null)
    Model.create(req.body)
      .then(
        function () {
          res.end()
        },
        function (erro) {
          res.status(500).json(erro)
        })
  }

  controller.getById = function (req, res) {
    var id = req.params.id
    Model.findById(id).exec()
        .then(function (data) {
          res.json(data)
        },
        function (erro) {
          res.status(500).json(erro)
        })
  }

  controller.update = function (req, res) {
    var id = req.params.id
    Model.update({'_id': id}, {$set: {'nome': req.body.nome, 'email': req.body.email}})
        .then(
          function () {
            res.end()
          },
          function (erro) {
            res.status(500).json(erro)
          })
  }

  controller.changePass = function (req, res) {
    var id = req.body._id
    req.body.senha = bcrypt.hashSync(req.body.senha, bcrypt.genSaltSync(8), null)
    Model.update({'_id': id}, {$set: {'senha': req.body.senha}})
          .then(
            function () {
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
