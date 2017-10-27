module.exports = function (app) {
  var controller = {}
  var jwt = require('jsonwebtoken')
  var Model = app.models.conteudo

  controller.getAll = function (req, res) {
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.find()
      .select('conteudo informacao _id')
      .exec()
      .then(function (data) {
        res.json(data)
      },
      function (erro) {
        res.status(500).json(erro)
      })
    })
  }

  controller.getById = function (req, res) {
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
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
    })
  }

  controller.insert = function (req, res) {
    var data = req.body.data
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.create(data)
      .then(function () {
        res.end()
      },
      function (erro) {
        res.status(500).json(erro)
      })
    })
  }

  controller.update = function (req, res) {
    var id = req.params.id
    var data = req.body.data
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.update({'_id': id}, {$set: data})
      .then(function () {
        res.end()
      },
      function (erro) {
        res.status(500).json(erro)
      })
    })
  }

  controller.delete = function (req, res) {
    var id = req.params.id
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.remove({'_id': id})
      .exec()
      .then(function () {
        res.end()
      },
      function (erro) {
        res.status(500).json(erro)
      })
    })
  }

  return controller
}
