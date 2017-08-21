var bcrypt   = require('bcrypt-nodejs');

module.exports = function(app) {
  var controller = {};
  var Conteudo = app.models.videos;
  var Usuario = app.models.user;
  var Admin = app.models.admin;
  var Quiz = app.models.quiz;

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
    var idconteudo = req.params.idconteudo;
    Conteudo.findByIdAndUpdate(idconteudo,{$pull : {videos : {_id : idvideo}}})
    .exec()
    .then(
      function() {
        res.end();
      },
      function(erro) {
        console.error(erro)
        res.status(500).json(erro);
      }
    );
  };


  controller.salvaVideo = function(req, res) {
    var url = req.body.data.url;
    var idconteudo = req.params.id;
    var idvideo = req.body.data._id;

    //conveter url em um iframe para o app
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      url =  "//www.youtube.com/embed/" + match[2];
    } else {
      res.status(500);
    }
    if(typeof idconteudo !== 'undefined' && idconteudo) {
      if(typeof idvideo !== 'undefined' && idvideo) {

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



  //Usuarios
  controller.listaTodosUsuarios = function(req, res) {
    Usuario.find()
    .exec()
    .then(
      function(usuarios) {
        res.json(usuarios);
      },
      function(erro) {
        console.error(erro)
        res.status(500).json(erro);
      }
    );
  };
  controller.obtemUsuario = function(req, res) {
    var email = req.body.data.email;
    Usuario.find()
    .where("email").equals(email)
    .exec()
    .then(
      function(usuario) {
        bcrypt.compare(req.body.data.senha, usuario[0].senha, function(err, response) {
          if(response){
            res.json(usuario);
          }
          else{
            res.status(500).json(err)
          }
        });
      },
      function(erro) {
        console.error(erro)
        res.status(500).json(erro);
      }
    );
  };

  controller.salvaUsuario = function(req, res) {
    var id = req.params.id;
    if(typeof id !== 'undefined' && id) {
    }
    else {
      //cria objeto para usar metodos do model
      var newUsuario = new Usuario();
      //criptografa a senha
      req.body.data.senha = newUsuario.generateHash(req.body.data.senha);
      Usuario.create(req.body.data)
      .then(
        function(usuario) {
          res.end();
        },
        function(erro) {
          console.log(erro);
          res.status(500).json(erro);
        }
      );
    }
  };

  //Quizz
  controller.listaTodasPerguntas = function(req, res) {
    Quiz.find()
    .exec()
    .then(
      function(perguntas) {
        res.json(perguntas);
      },
      function(erro) {
        console.error(erro)
        res.status(500).json(erro);
      }
    );
  };
  controller.obtemPergunta = function(req, res) {
    Quiz.count().exec(function (err, count) {
      // Get a random entry
      var random = Math.floor(Math.random() * count)

      // Again query all users but only fetch one offset by our random #
      Quiz.findOne().skip(random).exec(
        function (err, result) {
          res.json(result);
        })
      })
    };

    controller.removePergunta = function(req, res) {
      var id = req.params.id;
      Quiz.remove({"_id" : id}).exec()
      .then(
        function() {
          res.end();
        },
        function(erro) {
          return console.error(erro);
        }
      );
    };

    controller.salvaPergunta = function(req, res) {
      var id = req.params.id;
      if(typeof id !== 'undefined' && id) {
        Quiz.update({"_id"  : id},{$set : req.body.data})
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
        Quiz.create(req.body.data)
        .then(
          function(quiz) {
            res.end();
          },
          function(erro) {
            console.log(erro);
            res.status(500).json(erro);
          }
        );
      }
    };

    controller.salvaResposta = function(req, res) {
      var idusuario = req.body.data.idusuario;
      delete req.body.data.idusuario;
      Usuario.update({"_id"  : idusuario},{$push: {"respostas": req.body.data}},{safe: true, upsert: true, new : true})
      .then(
        function() {
          res.end();
        },
        function(erro) {
          res.status(500).json(erro);
        }
      );
    };

    //Informação
    controller.listaQuantidade = function(req, res) {
      Usuario.count({}, function(err, qtdUsuarios){
        Conteudo.count({}, function(err, qtdConteudos){
          Conteudo.aggregate({ $unwind : "$videos" },
          { $group: {
            _id: '',
            count: { $sum: 1 }
          }
        }, function(err, qtdVideos) {
          Quiz.count({}, function(err, qtdPerguntas){
            res.json(
              {
                qtdConteudos : qtdConteudos,
                qtdUsuarios : qtdUsuarios,
                qtdVideos : qtdVideos[0].count,
                qtdPerguntas: qtdPerguntas
              }
            );
          });
        });
      });
    });
  };

  //Administradores
  controller.listaTodosAdmins = function(req, res) {
    Admin.find()
    .exec()
    .then(
      function(admins) {
        res.json(admins);
      },
      function(erro) {
        console.error(erro)
        res.status(500).json(erro);
      }
    );
  };

  controller.salvaAdmin = function(req, res) {
    //cria objeto para usar metodos do model
    var newAdmin = new Usuario();
    //criptografa a senha
    req.body.data.senha = newAdmin.generateHash(req.body.data.senha);
    Admin.create(req.body.data)
    .then(
      function(usuario) {
        res.end();
      },
      function(erro) {
        console.log(erro);
        res.status(500).json(erro);
      }
    );
  };

  //Minha Conta
  controller.getUsuario = function(req, res) {
    res.json(req.user);
  };

  controller.editUsuario = function(req, res) {
    var id = req.body.data._id;
    Admin.update({"_id"  : id},{$set : {"nome" : req.body.data.nome, "email" : req.body.data.email}})
    .then(
      function() {
        res.end();
      },
      function(erro) {
        console.log(erro);
        res.status(500).json(erro);
      }
    );
  };

  controller.mudaSenha = function(req, res) {
    var id = req.body.data._id;
    //cria objeto para usar metodos do model
    var newUsuario = new Usuario();
    //criptografa a senha
    req.body.data.senha = newUsuario.generateHash(req.body.data.senha);
    Admin.update({"_id"  : id},{$set : {"senha" : req.body.data.senha}})
    .then(
      function() {
        res.end();
      },
      function(erro) {
        console.log(erro);
        res.status(500).json(erro);
      }
    );
  };

  return controller;
}
