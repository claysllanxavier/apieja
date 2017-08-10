module.exports = function() {
  var controller = {};
  controller.index = function(req, res) {
    res.render('index',{
      page_name: 'home'
    });
  };

  controller.listarVideos = function(req, res) {
    res.render('videos',{
      page_name: 'videos'
    });
  };

  controller.listarConteudos = function(req, res) {
    res.render('conteudos',{
      page_name: 'conteudos'
    });
  };
  return controller;
}
