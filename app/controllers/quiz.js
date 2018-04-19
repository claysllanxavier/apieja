module.exports = function (app) {
  var controller = {}
  var jwt = require('jsonwebtoken')
  var auditLog = require('audit-log');
  var Model = app.models.quiz
  var models = app.models

  controller.getById = function (req, res) {
    var idconteudo = req.params.idconteudo
    var idpergunta = req.params.idpergunta
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model
        .findOne({ _id: idpergunta })
        .populate('conteudo', '_id')
        .then(data => {
          if (req.user) auditLog.logEvent(req.user.nome, 'System', 'Visualizou uma Pergunta')
          res.json(data)
        })
        .catch(function (erro) {
          res.status(500).json(erro)
        })
    })
  }

  controller.insert = function (req, res) {
    var idconteudo = req.params.idconteudo
    var idadministrador = (req.user) ? req.user._id : '5aa14d7db8862e024b15941a'
    req.body.data.idadministrador = idadministrador
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      models.conteudo.findById(idconteudo)
        .then(conteudo => {
          return Model.create({
            pergunta: req.body.data.pergunta,
            respostas: req.body.data.respostas,
            respostaCerta: req.body.data.respostaCerta,
            professor: idadministrador,
            conteudo: conteudo._id
          })
        })
        .then(instance => {
          return models.conteudo.update({ '_id': instance.conteudo }, { $push: { 'perguntas': instance._id } }, { safe: true, upsert: true, new: true })
        })
        .then(() => {
          if (req.user) auditLog.logEvent(req.user.nome, 'System', 'Inseriu uma nova Pergunta')
          res.end()
        })
        .catch(erro => {
          console.log(erro)
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
      Model.update({ '_id': idpergunta }, {
        $set: req.body.data
      })
        .then(function () {
          if (req.user) auditLog.logEvent(req.user.nome, 'System', 'Atualizou um Quiz')
          res.end()
        })
        .catch(erro => {
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
      Model.remove({ _id: idpergunta })
        .then(() => {
          return models.conteudo.findByIdAndUpdate(idconteudo, { $pull: { perguntas: idpergunta } })
        })
        .then(() => {
          if (req.user) auditLog.logEvent(req.user.nome, 'System', 'Deletou um Quiz')
          res.end()
        })
        .catch(erro => {
          res.status(500).json(erro)
        })
    })
  }

  controller.getByConteudo = function (req, res) {
    var id = req.params.idconteudo
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.find({ conteudo: id })
        .populate('conteudo', '_id')
        .then(data => {
          if (req.user) auditLog.logEvent(req.user.nome, 'System', 'Visualizou o Quiz de um Conteúdo')
          res.json(data)
        })
        .catch(erro => {
          res.status(500).json(erro)
        })
    })
  }

  return controller
}
