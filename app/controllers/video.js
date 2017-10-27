module.exports = function (app) {
  var controller = {}
  var jwt = require('jsonwebtoken')
  var Model = app.models.conteudo

  controller.getById = function (req, res) {
    var idconteudo = req.params.idconteudo
    var idvideo = req.params.idvideo
    var token = req.headers['x-access-token']
    if (!token) return res.status(401).render('401')
    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      Model.findById(idconteudo)
      .select('videos _id')
      .exec()
      .then(function (myDocument) {
        let data = {}
        data['_id'] = myDocument._id
        data['video'] = myDocument.videos.id(idvideo)
        res.json(data)
      },
      function (erro) {
        res.status(500).json(erro)
      })
    })
  }

  controller.insert = function (req, res) {
    var url = req.body.data.url
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
      Model.update({'_id': idconteudo}, {$push: {'videos': {nome: req.body.data.nome, url: url}}}, {safe: true, upsert: true, new: true})
      .then(
        function () {
          res.end()
        },
        function (erro) {
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
        Model.findById(idconteudo)
        .select('videos _id')
        .exec()
        .then(function (myDocument) {
          let item =  myDocument.videos.id(idvideo)
          item.nome = req.body.data.nome
          item.url = url
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
      var idvideo = req.params.idvideo
      var idconteudo = req.params.idconteudo
      var token = req.headers['x-access-token']
      if (!token) return res.status(401).render('401')
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        Model.findByIdAndUpdate(idconteudo, {$pull: {videos: {_id: idvideo}}})
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

      controller.getByConteudo = function (req, res) {
        var id = req.params.idconteudo
        var token = req.headers['x-access-token']
        if (!token) return res.status(401).render('401')
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
          Model.findById(id)
          .select('videos _id')
          .exec()
          .then(
            function (data) {
              res.json(data)
            },
            function (erro) {
              res.status(500).json(erro)
            })
          })
        }

        return controller
      }
