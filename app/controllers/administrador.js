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
    var data = req.body.data
    data.senha = bcrypt.hashSync(data.senha, bcrypt.genSaltSync(8), null)
    Model.create(data)
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
    var data = req.body.data
    Model.update({'_id': id}, {$set: data})
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
    var data = req.body.data
    data.senha = bcrypt.hashSync(data.senha, bcrypt.genSaltSync(8), null)
    Model.update({'_id': id}, {$set: {'senha': data.senha}})
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
  controller.getUser = function (req, res) {
    res.json(req.user)
  }

  return controller
}
