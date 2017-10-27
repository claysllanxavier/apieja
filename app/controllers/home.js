module.exports = function () {
  var controller = {}
  var jwt = require('jsonwebtoken')

  controller.index = function (req, res) {
    res.render('index', {
      usuarioLogado: req.user.nome,
      usuarioEmail: req.user.email
    })
  }

  controller.gettoken = function (req, res) {
    var token = jwt.sign({ id: req.user._id }, process.env.SECRET, {
      expiresIn: 86400 
    })
    res.status(200).json({ auth: true, token: token })
  }

  return controller
}
