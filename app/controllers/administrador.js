var bcrypt = require('bcrypt-nodejs')
module.exports = function (app) {
  var controller = {}
  var jwt = require('jsonwebtoken')
  var auditLog = require('audit-log');
  var Model = app.models.admin

  controller.getAll = function (req, res) {
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.find()
      .exec()
      .then(function (data) {
        if(req.user) auditLog.logEvent(req.user.nome, 'System', 'Vizualizou os Administradores')
        res.json(data)
      },
      function (erro) {
        res.status(500).json(erro)
      })
    })
  }

  controller.insert = function (req, res) {
    var data = req.body.data
    data.senha = bcrypt.hashSync(data.senha, bcrypt.genSaltSync(8), null)
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.create(data)
      .then(
        function () {
          if(req.user) auditLog.logEvent(req.user.nome, 'System', 'Inseriu um novo Administrador')
          res.end()
        },
        function (erro) {
          console.log(erro)
          res.status(500).json(erro)
        })
      })
    }

    controller.getById = function (req, res) {
      var id = req.params.id
      var token = req.headers['x-access-token']
      if (!token) return res.status(401).render('401')
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        Model.findById(id).exec()
        .then(function (data) {
          if(req.user) auditLog.logEvent(req.user.nome, 'System', 'Vizualizou um Administrador')
          res.json(data)
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
        .then(
          function () {
            if(req.user) auditLog.logEvent(req.user.nome, 'System', 'Atualizou um novo Administrador')
            res.end()
          },
          function (erro) {
            res.status(500).json(erro)
          })
        })
      }

      controller.changePass = function (req, res) {
        var id = req.body.data._id
        var data = req.body.data
        data.senha = bcrypt.hashSync(data.senha, bcrypt.genSaltSync(8), null)
        var token = req.headers['x-access-token']
        if (!token) return res.status(401).render('401')
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
          Model.update({'_id': id}, {$set: {'senha': data.senha}})
          .then(
            function () {
              if(req.user) auditLog.logEvent(req.user.nome, 'System', 'Mudou a senha')
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
              if(req.user)  auditLog.logEvent(req.user.nome, 'System', 'Deletou um Administrador')
              res.end()
            },
            function (erro) {
              res.status(500).json(erro)
            })
          })
        }
        
        controller.getUser = function (req, res) {
          var token = req.headers['x-access-token']
          if (!token) return res.status(401).render('401')
          jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if(req.user) auditLog.logEvent(req.user.nome, 'System', 'Visualizou sua conta')
            res.json(req.user)
          })
        }

        return controller
      }
