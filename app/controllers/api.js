var bcrypt = require('bcrypt-nodejs')

module.exports = function (app) {
  var controller = {}
  var Conteudo = app.models.conteudo
  var Usuario = app.models.user
  var Admin = app.models.admin

  controller.obtemPergunta = function (req, res) {
    var idconteudo = req.params.idconteudo
    var idusuario = req.params.idusuario
    Conteudo.findById(idconteudo)
    .select('perguntas _id')
    .exec()
    .then(
      function (perguntas) {
        Usuario.findById(idusuario)
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
        console.error(erro)
        res.status(404).json(erro)
      }
    )
  }

  controller.salvaResposta = function (req, res) {
    var idusuario = req.body.data.idusuario
    delete req.body.data.idusuario
    delete req.body.data.respostaUsuario
    Usuario.update({'_id': idusuario}, {$push: {'respostas': req.body.data}}, {safe: true, upsert: true, new: true})
    .then(
      function () {
        res.end()
      },
      function (erro) {
        res.status(500).json(erro)
      }
    )
  }

  // Conteudo
  controller.obtemConteudoQuiz = function (req, res) {
    var idusuario = req.params.id
    Conteudo.find()
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
        console.error(erro)
        res.status(500).json(erro)
      }
    )
  }

  // Usuarios
  controller.listaTodosUsuarios = function (req, res) {
    Usuario.find()
    .exec()
    .then(
      function (usuarios) {
        res.json(usuarios)
      },
      function (erro) {
        console.error(erro)
        res.status(500).json(erro)
      }
    )
  }
  controller.obtemUsuario = function (req, res) {
    var email = req.body.data.email
    Usuario.findOne({ email: email })
    .exec(function (erro, user) {
      if (erro) {
        console.error(erro)
        res.status(500).json(erro)
      } else if (!user) {
        var erro = new Error('User not found.')
        res.status(500).json(erro)
      } else {
        bcrypt.compare(req.body.data.senha, user.senha, function (err, response) {
          if (response) {
            res.json(user)
          } else {
            res.status(500).json(err)
          }
        })
      }
    })
  }

  controller.salvaUsuario = function (req, res) {
    var id = req.params.id
    if (typeof id !== 'undefined' && id) {
    } else {
    // cria objeto para usar metodos do model
      var newUsuario = new Usuario()
    // criptografa a senha
      req.body.data.senha = newUsuario.generateHash(req.body.data.senha)
      Usuario.create(req.body.data)
    .then(
      function (usuario) {
        res.end()
      },
      function (erro) {
        console.log(erro)
        res.status(500).json(erro)
      }
    )
    }
  }

  controller.limparQuiz = function (req, res) {
    var idusuario = req.params.idusuario
    var idconteudo = req.params.idconteudo
    Usuario.findByIdAndUpdate(idusuario, {$pull: {respostas: {idconteudo: idconteudo}}})
  .exec()
  .then(
    function () {
      res.end()
    },
    function (erro) {
      console.error(erro)
      res.status(500).json(erro)
    }
  )
  }

// Informação
  controller.listaQuantidade = function (req, res) {
    Usuario.count({}, function (err, qtdUsuarios) {
      Conteudo.count({}, function (err, qtdConteudos) {
        Conteudo.aggregate({ $unwind: '$videos' },
          { $group: {
            _id: '',
            count: { $sum: 1 }
          }
          }, function (err, qtdVideos) {
            Conteudo.aggregate({ $unwind: '$perguntas' },
              { $group: {
                _id: '',
                count: { $sum: 1 }
              }
              }, function (err, qtdPerguntas) {
                if (typeof qtdPerguntas[0] === 'undefined' && typeof qtdVideos[0] === 'undefined') {
                  res.json(
                    {
                      qtdConteudos: qtdConteudos,
                      qtdUsuarios: qtdUsuarios,
                      qtdVideos: 0,
                      qtdPerguntas: 0
                    })
                } else if (typeof qtdPerguntas[0] === 'undefined') {
                  res.json(
                    {
                      qtdConteudos: qtdConteudos,
                      qtdUsuarios: qtdUsuarios,
                      qtdVideos: qtdVideos[0].count,
                      qtdPerguntas: 0
                    })
                } else if (typeof qtdVideos[0] === 'undefined') {
                  res.json(
                    {
                      qtdConteudos: qtdConteudos,
                      qtdUsuarios: qtdUsuarios,
                      qtdVideos: 0,
                      qtdPerguntas: qtdPerguntas[0].count
                    })
                } else {
                  res.json(
                    {
                      qtdConteudos: qtdConteudos,
                      qtdUsuarios: qtdUsuarios,
                      qtdVideos: qtdVideos[0].count,
                      qtdPerguntas: qtdPerguntas[0].count
                    })
                }
              })
          })
      })
    })
  }

  return controller
}
