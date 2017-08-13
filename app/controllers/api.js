module.exports = function(app) {
  var controller = {};
  var Conteudo = app.models.videos;

  //Vídeos
  controller.listaTodosVideos = function(req, res) {
    Conteudo.find()
    .exec()
    .then(
      function(videos) {
        if (!videos) throw new Error("Vídeos não encontrado");
        res.json(videos);
      },
      function(erro) {
        console.error(erro)
        res.status(404).json(erro)
      }
    );
  };

  controller.obtemVideobyConteudo = function(req, res) {
    var id = req.params.id;
    Conteudo.findById(id)
    .exec()
    .then(
      function(videos) {
        if (!videos) throw new Error("Vídeos não encontrado");
        res.json(videos);
      },
      function(erro) {
        console.error(erro)
        res.status(404).json(erro);
      }
    );
  };
  controller.obtemVideo = function(req, res) {};

  controller.removeVideo = function(req, res) {
    var idvideo = req.params.idvideo;
    console.log(req.params.idconteudo);
  };


  controller.salvaVideo = function(req, res) {
    var url = req.body.data.url;
    var idconteudo = req.params.id;
    var idvideo = req.body.data._id;

    //conveter url em um iframe para o app
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      url =  "https://www.youtube.com/embed/" + match[2];
    } else {
      res.status(500);
    }
    if(typeof idconteudo !== 'undefined' && idconteudo) {
      if(typeof idvideo !== 'undefined' && idvideo) {
        Conteudo.findOneAndUdate(
          { "_id": idconteudo, "videos._id": idvideo },
          {
            "$set": {
              "nome": req.body.data.nome,
              "url": url
            }
          })
          .then(
            function() {
              res.end();
            },
            function(erro) {
              res.status(500).json(erro);
            }
          );
        } else{
          Conteudo.update({"_id"  : idconteudo},{$push: {"videos": {nome: req.body.data.nome, url: url}}},{safe: true, upsert: true, new : true})
          .then(
            function() {
              res.end();
            },
            function(erro) {
              res.status(500).json(erro);
            }
          );
        }
      }
      else {
        res.status(500);
      }
    };

    //Conteudo
    controller.listaTodosConteudos = function(req, res) {
      Conteudo.find()
      .select("conteudo informacao _id")
      .exec()
      .then(
        function(conteudos) {
          res.json(conteudos);
        },
        function(erro) {
          console.error(erro)
          res.status(500).json(erro);
        }
      );
    };
    controller.obtemConteudo = function(req, res) {};

    controller.removeConteudo = function(req, res) {
      var id = req.params.id;
      Conteudo.remove({"_id" : id}).exec()
      .then(
        function() {
          res.end();
        },
        function(erro) {
          return console.error(erro);
        }
      );
    };

    controller.salvaConteudo = function(req, res) {
      var id = req.params.id;
      if(typeof id !== 'undefined' && id) {
        Conteudo.update({"_id"  : id},{$set : {"conteudo" : req.body.data.conteudo, "informacao" : req.body.data.informacao}})
        .then(
          function() {
            res.end();
          },
          function(erro) {
            console.log(erro);
            res.status(500).json(erro);
          }
        );
      }
      else {
        Conteudo.create(req.body.data)
        .then(
          function(conteudo) {
            res.end();
          },
          function(erro) {
            console.log(erro);
            res.status(500).json(erro);
          }
        );
      }
    };


    return controller;
  }
