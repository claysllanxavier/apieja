module.exports = function (app) {
  var controller = {}
  var jwt = require('jsonwebtoken')
  var auditLog = require('audit-log');
  var Model = app.models.conteudo
  var Usuario = app.models.user

  controller.getAll = function (req, res) {
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.find()
      .select('conteudo informacao _id')
      .exec()
      .then(function (data) {
        if(req.user) auditLog.logEvent(req.user.nome, 'System', 'Vizualizou os Conteudos')
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
        if(req.user) auditLog.logEvent(req.user.nome, 'System', 'Vizualizou um Conteudo')
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
        if(req.user) auditLog.logEvent(req.user.nome, 'System', 'Inseriu um  novo Conteudo')
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
        if(req.user) auditLog.logEvent(req.user.nome, 'System', 'Atualizou um Conteudo')
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
      .then(function () {
        return app.models.video.remove({'conteudo' : id})
      })
      .then(function () {
        return app.models.quiz.remove({'conteudo' : id})
      })
      .then(() =>{
        if(req.user) auditLog.logEvent(req.user.nome, 'System', 'Deletou um Conteudo')
        res.end()
      })
      .catch(function (erro) {
        res.status(500).json(erro)
      })
    })
  }

  controller.getByUsuario = function (req, res) {
    var idusuario = req.params.idusuario
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.find()
      .select('conteudo informacao perguntas _id')
      .exec()
      .then(
        function (conteudos) {
          var array = []
          var object = {}
          Usuario.findById(idusuario)
          .select('respostas')
          .exec()
          .then(function (usuario) {
            var count = 0
            for (var i = 0; i < conteudos.length; i++) {
              for (var j = 0; j < usuario.respostas.length; j++) {
                if (conteudos[i]._id.toString() == usuario.respostas[j].idconteudo.toString()) {
                  count++
                }
              }
              object = {_id: conteudos[i]._id, conteudo: conteudos[i].conteudo, informacao: conteudos[i].informacao, qtdperguntas: conteudos[i].perguntas.length, qtdrespostas: count }
              array.push(object)
              count = 0
            }
            res.json(array)
          })
        },
        function (erro) {
          res.status(500).json(erro)
        })
      })
    }

    return controller
  }
