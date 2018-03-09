module.exports = function () {
  var controller = {}
  var auditLog = require('audit-log');
  var jwt = require('jsonwebtoken')

  controller.index = function (req, res) {
    auditLog.logEvent(req.user.nome, 'System', 'Logou no Sistema')
    res.render('index', {
      usuarioLogado: req.user.nome,
      usuarioEmail: req.user.email
    })
  }

  controller.gettoken = function (req, res) {
    var token = jwt.sign({ id: req.user._id }, process.env.SECRET, {
      expiresIn: 86400 
    })
    res.status(200).json({ auth: true, token: token, user: req.user})
  }

  return controller
}
