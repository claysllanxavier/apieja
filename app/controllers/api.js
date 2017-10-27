module.exports = function (app) {
  var controller = {}
  var jwt = require('jsonwebtoken')
  var Conteudo = app.models.conteudo
  var Usuario = app.models.user
  var Admin = app.models.admin


  // Informação
  controller.listaQuantidade = function (req, res) {
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
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
        })
      }

      return controller
    }
