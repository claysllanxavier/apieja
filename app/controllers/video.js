module.exports = function (app) {
  var controller = {}
  var jwt = require('jsonwebtoken')
  var auditLog = require('audit-log')
  var Model = app.models.video
  var models = app.models

  controller.getById = function (req, res) {
    var idconteudo = req.params.idconteudo
    var idvideo = req.params.idvideo
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model
        .findOne({ _id: idvideo })
        .populate('conteudo', '_id')
        .then(data => {
          if (req.user) auditLog.logEvent(req.user.nome, 'System', 'Visualizou um Video')
          res.json(data)
        })
        .catch(function (erro) {
          res.status(500).json(erro)
        })
    })
  }

  controller.insert = function (req, res) {
    var url = req.body.data.url
    var idconteudo = req.params.idconteudo
    var idadministrador = (req.user) ? req.user._id : '5aa14d7db8862e024b15941a'
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      // conveter url em um iframe para o app
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
      var match = (url) ? url.match(regExp) : null
      if (match && match[2].length == 11) {
        url = 'https://www.youtube.com/embed/' + match[2]
      } else {
        res.status(500)
      }
      models.conteudo.findById(idconteudo)
        .then(conteudo => {
          return Model.create({
            nome: req.body.data.nome,
            url: url,
            professor: idadministrador,
            conteudo: conteudo._id
          })
        })
        .then(video => {
          return models.conteudo.update({ '_id': video.conteudo }, { $push: { 'videos': video._id } }, { safe: true, upsert: true, new: true })
        })
        .then(() => {
          if (req.user) auditLog.logEvent(req.user.nome, 'System', 'Inseriu um novo Vídeo')
          res.end()
        })
        .catch(erro => {
          res.status(500).json(erro)
        })

    })
  }

  controller.update = function (req, res) {
    var url = req.body.data.url
    var idvideo = req.params.idvideo
    var idconteudo = req.params.idconteudo
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      // conveter url em um iframe para o app
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
      var match = url.match(regExp)
      if (match && match[2].length == 11) {
        url = 'https://www.youtube.com/embed/' + match[2]
      } else {
        res.status(500)
      }
      Model.update({ '_id': idvideo }, {
        $set: {
          nome: req.body.data.nome,
          url: url
        }
      })
        .then(function () {
          if (req.user) auditLog.logEvent(req.user.nome, 'System', 'Atualizou um Video')
          res.end()
        })
        .catch(erro => {
          res.status(500).json(erro)
        })
    })
  }

  controller.delete = function (req, res) {
    var idvideo = req.params.idvideo
    var idconteudo = req.params.idconteudo
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.remove({ _id: idvideo })
        .then(() => {
          return models.conteudo.findByIdAndUpdate(idconteudo, { $pull: { videos: idvideo } })
        })
        .then(() => {
          if (req.user) auditLog.logEvent(req.user.nome, 'System', 'Deletou um Vídeo')
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
          if (req.user) auditLog.logEvent(req.user.nome, 'System', 'Visualizou os Vídeos de um Conteúdo')
          res.json(data)
        })
        .catch(erro => {
          res.status(500).json(erro)
        })
    })
  }

  return controller
}
