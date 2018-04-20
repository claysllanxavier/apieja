module.exports = function (app) {
  var controller = {}
  var bcrypt = require('bcrypt-nodejs')
  var jwt = require('jsonwebtoken')
  var auditLog = require('audit-log');
  var Model = app.models.user
  var Conteudo = app.models.conteudo
  var models = app.models

  controller.getAll = function (req, res) {
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.find()
        .exec()
        .then(function (data) {
          if (req.user) auditLog.logEvent(req.user.nome, 'System', 'Visualizou os Usuários')
          res.json(data)
        },
          function (erro) {
            res.status(500).json(erro)
          })
    })
  }

  controller.getById = function (req, res) {
    var id = req.params.id
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.findById(id)
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
    data.senha = bcrypt.hashSync(data.senha, bcrypt.genSaltSync(8), null)
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
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.update({ '_id': id }, { $set: data })
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
      Model.remove({ '_id': id })
        .exec()
        .then(function () {
          res.end()
        },
          function (erro) {
            res.status(500).json(erro)
          })
    })
  }

  controller.getQuestion = function (req, res) {
    var idconteudo = req.params.idconteudo
    var idusuario = req.params.idusuario
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      let data = {}
      models.quiz.find({ conteudo: idconteudo })
        .populate('conteudo', '_id')
        .then(instance => {
          data = instance
          return models.resposta.find({ 'usuario': idusuario, 'conteudo': idconteudo })
        })
        .then(function (respostas) {
          if (respostas.length == 0) {
            var pergunta = {}
            pergunta['_id'] = data[0].conteudo._id
            pergunta['idpergunta'] = data[0]._id
            pergunta['pergunta'] = data[0].pergunta
            pergunta['respostas'] = data[0].respostas
            pergunta['respostaCerta'] = data[0].respostaCerta
            res.json(pergunta)
          } else {
            var acertou = 0
            if (data.length === respostas.length) {
              for (var i = 0; i < respostas.length; i++) {
                if (respostas[i].acertou) {
                  acertou++
                }
              }
              res.json({ qtdacertos: acertou, qtdperguntas: respostas.length })
            } else {
              var pergunta = {}
              for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < respostas.length; j++) {
                  if (data[i]._id !== respostas[j].pergunta) {
                    pergunta['_id'] = data[i].conteudo._id
                    pergunta['idpergunta'] = data[i]._id
                    pergunta['pergunta'] = data[i].pergunta
                    pergunta['respostas'] = data[i].respostas
                    pergunta['respostaCerta'] = data[i].respostaCerta
                  }
                }
              }
              res.json(pergunta)
            }
          }
        })
        .catch(erro => {
          res.status(500).json(erro)
        })
    })
  }

  controller.saveAnswer = function (req, res) {
    var data = req.body.data
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      models.resposta.create({
        conteudo: data.idconteudo,
        pergunta: data.idpergunta,
        acertou: data.acertou,
        usuario: data.idusuario
      })
        .then(() => {
          res.end()
        })
        .catch(erro => {
          res.status(500).json(erro)
        })
    })
  }

  controller.login = function (req, res) {
    var email = req.body.data.email
    Model.findOne({ email: email })
      .exec(function (erro, user) {
        if (erro) {
          res.status(500).json(erro)
        } else if (!user) {
          res.status(500).json(erro)
        } else {
          bcrypt.compare(req.body.data.senha, user.senha, function (err, response) {
            if (response) {
              user.token = jwt.sign({ id: user._id }, process.env.SECRET, {
                expiresIn: 86400
              })
              res.json(user)
            } else {
              res.status(500).json(err)
            }
          })
        }
      })
  }

  controller.clearQuiz = function (req, res) {
    var idusuario = req.params.idusuario
    var idconteudo = req.params.idconteudo
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      models.resposta.remove({ 'conteudo': idconteudo, 'usuario': idusuario })
        .then(() => {
          res.end()
        })
        .catch(function (erro) {
          res.status(500).json(erro)
        })
    })
  }


  return controller
}
