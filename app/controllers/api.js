module.exports = function (app) {
  var controller = {}
  var jwt = require('jsonwebtoken')
  var models = app.models

  // Informação
  controller.listaQuantidade = function (req, res) {
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      let quantidade = {}
      models.user.count({})
        .then(usuarios => {
          quantidade.qtdUsuarios = usuarios
          return models.conteudo.count({})
        })
        .then(conteudos => {
          quantidade.qtdConteudos = conteudos
          return models.video.count({})
        })
        .then(videos => {
          quantidade.qtdVideos = videos
          return models.quiz.count({})
        })
        .then(quiz =>{
          quantidade.qtdPerguntas = quiz
          res.status(200).json(quantidade)
        })
        .catch(erro =>{
          console.log(erro)
          res.status(500).json(erro)
        })
    })
  }

  return controller
}
