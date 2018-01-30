module.exports = function (app) {
  var controller = {}
  var bcrypt = require('bcrypt-nodejs')
  var jwt = require('jsonwebtoken')
  var auditLog = require('audit-log');
  var Model = app.models.user
  var Conteudo = app.models.conteudo

  controller.getAll = function (req, res) {
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.find()
      .exec()
      .then(function (data) {
        auditLog.logEvent(req.user.nome, 'System', 'Visualizou os Usuários')
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

  controller.getQuestion = function (req, res) {
    var idconteudo = req.params.idconteudo
    var idusuario = req.params.idusuario
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Conteudo.findById(idconteudo)
      .select('perguntas _id')
      .exec()
      .then(
        function (perguntas) {
          Model.findById(idusuario)
          .select('respostas _id')
          .where('respostas.idconteudo').equals(idconteudo)
          .exec()
          .then(function (usuario) {
            if (usuario === null) {
              var pergunta = {}
              pergunta['_id'] = perguntas._id
              pergunta['idpergunta'] = perguntas.perguntas[0]._id
              pergunta['pergunta'] = perguntas.perguntas[0].pergunta
              pergunta['respostas'] = perguntas.perguntas[0].respostas
              pergunta['respostaCerta'] = perguntas.perguntas[0].respostaCerta
              res.json(pergunta)
            } else {
              var acertou = 0
              if (perguntas.perguntas.length === usuario.respostas.length) {
                for (var i = 0; i < usuario.respostas.length; i++) {
                  if (usuario.respostas[i].acertou) {
                    acertou++
                  }
                }
                res.json({qtdacertos: acertou, qtdperguntas: usuario.respostas.length})
              } else {
                var pergunta = {}
                for (var i = 0; i < perguntas.perguntas.length; i++) {
                  for (var j = 0; j < usuario.respostas.length; j++) {
                    if (perguntas.perguntas[i]._id !== usuario.respostas[j].idperguntas) {
                      pergunta['_id'] = perguntas._id
                      pergunta['idpergunta'] = perguntas.perguntas[i]._id
                      pergunta['pergunta'] = perguntas.perguntas[i].pergunta
                      pergunta['respostas'] = perguntas.perguntas[i].respostas
                      pergunta['respostaCerta'] = perguntas.perguntas[i].respostaCerta
                    }
                  }
                }
                res.json(pergunta)
              }
            }
          })
        },
        function (erro) {
          res.status(500).json(erro)
        })
      })
    }

    controller.saveAnswer = function (req, res) {
      var idusuario = req.body.data.idusuario
      var token = req.headers['x-access-token']
      if (!token) return res.status(401).render('401')
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        Model.update({'_id': idusuario}, {$push: {'respostas': req.body.data}}, {safe: true, upsert: true, new: true})
        .then(
          function () {
            res.end()
          },
          function (erro) {
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
          Model.findByIdAndUpdate(idusuario, {$pull: {respostas: {idconteudo: idconteudo}}}, {safe : true})
          .exec()
          .then(
            function () {
              res.end()
            },
            function (erro) {
              res.status(500).json(erro)
            })
          })
        }


        return controller
      }
