module.exports = function (app) {
  var controller = {}
  var jwt = require('jsonwebtoken')
  var auditLog = require('audit-log');
  var Model = app.models.conteudo

  controller.getById = function (req, res) {
    var idconteudo = req.params.idconteudo
    var idpergunta = req.params.idpergunta
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.findById(idconteudo)
        .select('perguntas _id')
        .exec()
        .then(function (myDocument) {
          auditLog.logEvent(req.user.nome, 'System', 'Visualizou um Quiz')
          let data = {}
          data['_id'] = myDocument._id
          data['pergunta'] = myDocument.perguntas.id(idpergunta)
          res.json(data)
        },
        function (erro) {
          res.status(500).json(erro)
        })
    })
  }

  controller.insert = function (req, res) {
    var idconteudo = req.params.idconteudo
    var idadministrador = req.user._id
    req.body.data.idadministrador = idadministrador
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.update({ '_id': idconteudo }, { $push: { 'perguntas': req.body.data } }, { safe: true, upsert: true, new: true })
        .then(
        function () {
          auditLog.logEvent(req.user.nome, 'System', 'Inseriu um novo Quiz')
          res.end()
        },
        function (erro) {
          res.status(500).json(erro)
        })
    })
  }

  controller.update = function (req, res) {
    var idconteudo = req.params.idconteudo
    var idpergunta = req.params.idpergunta
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.findById(idconteudo)
        .select('perguntas _id')
        .exec()
        .then(function (myDocument) {
          auditLog.logEvent(req.user.nome, 'System', 'Atualizou um  Quiz')
          let item = myDocument.perguntas.id(idpergunta)
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
    })
  }

  controller.delete = function (req, res) {
    var idpergunta = req.params.idpergunta
    var idconteudo = req.params.idconteudo
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.findByIdAndUpdate(idconteudo, { $pull: { perguntas: { _id: idpergunta } } })
        .exec()
        .then(
        function () {
          auditLog.logEvent(req.user.nome, 'System', 'Deletou um  Quiz')
          res.end()
        },
        function (erro) {
          res.status(500).json(erro)
        })
    })
  }

  controller.getByConteudo = function (req, res) {
    var id = req.params.idconteudo
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.findById(id)
        .select('perguntas _id')
        .exec()
        .then(
        function (data) {
          auditLog.logEvent(req.user.nome, 'System', 'Visualizou os Quiz de um Conteúdo')
          res.json(data)
        },
        function (erro) {
          res.status(500).json(erro)
        })
    })
  }

  return controller
}
