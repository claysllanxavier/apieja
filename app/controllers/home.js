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

  controller.listarUsuarios = function(req, res) {
    res.render('usuarios',{
      page_name: 'usuarios',
      usuarioLogado : req.user.nome,
      usuarioEmail : req.user.email
    });
  };

  controller.listarAdmins = function(req, res) {
    res.render('admins',{
      page_name: 'admins',
      usuarioLogado : req.user.nome,
      usuarioEmail : req.user.email
    });
  };

  controller.listaPerguntas = function(req, res) {
    res.render('quiz',{
      page_name: 'quiz',
      usuarioLogado : req.user.nome,
      usuarioEmail : req.user.email
    });
  };

  controller.minhaConta = function(req, res) {
    res.render('minhaconta',{
      page_name: 'minhaconta',
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
