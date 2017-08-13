module.exports = function() {
  var controller = {};
  controller.index = function(req, res) {
    res.render('index',{
      page_name: 'home',
      usuarioLogado : req.user.nome,
      usuarioEmail : req.user.email
    });
  };

  controller.listarVideos = function(req, res) {
    res.render('videos',{
      page_name: 'videos',
      idconteudo : req.session.idconteudo,
      usuarioLogado : req.user.nome,
      usuarioEmail : req.user.email
    });
  };

  controller.listarConteudos = function(req, res) {
    res.render('conteudos',{
      page_name: 'conteudos',
      usuarioLogado : req.user.nome,
      usuarioEmail : req.user.email
    });
  };

  controller.redictVideos = function(req, res) {
    var id = req.params.id;
    req.session.idconteudo = id;
    res.redirect('/videos');
  };

  return controller;
}
