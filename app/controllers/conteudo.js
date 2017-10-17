module.exports = function(app) {
  var controller = {};
  var Model = app.models.videos;

  controller.getAll = function(req, res) {
    Model.find()
    .select("conteudo informacao _id")
    .exec()
    .then(function(data) {
      res.json(data);
    },
    function(erro) {
      console.error(erro)
      res.status(500).json(erro);
    });
  };

  controller.getById = function(req, res) {
    var id = req.params.id;
    Model.findById(id)
    .select("conteudo informacao _id")
    .exec()
    .then(function(data) {
      res.json(data);
    },
    function(erro) {
      console.error(erro)
      res.status(500).json(erro);
    });
  };

  controller.insert = function(req, res) {
    Model.create(req.body)
    .then(function() {
      res.end();
    },
    function(erro) {
      res.status(500).json(erro);
    })
  };

  controller.update = function(req, res) {
    var id = req.params.id;
    Model.update({"_id"  : id},{$set : req.body})
    .then(function() {
      res.end();
    },
    function(erro) {
      console.error(erro)
      res.status(500).json(erro);
    })
  };

  controller.delete = function(req, res) {
    var id = req.params.id;
    Model.remove({"_id" : id})
    .exec()
    .then(function() {
      res.end();
    },
    function(erro) {
      console.error(erro)
      res.status(500).json(erro);
    });
  };

  return controller;
}
