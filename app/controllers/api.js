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

  controller.obtemVideo = function(req, res) {
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
  controller.removeContato = function(req, res) {};
  controller.salvaContato = function(req, res) {};

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
