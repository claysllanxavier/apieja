module.exports = function (app) {
  var controller = {}
  var User = app.models.admin
  var async = require('async');
  var crypto = require('crypto');
  var smtpTransport = require('../../config/nodemailer');
  var bcrypt = require('bcrypt-nodejs')


  controller.exibeLogin = function (req, res) {
    res.render('login', { message: req.flash('loginMessage') })
  }

  controller.fazLogout = function (req, res) {
    req.logout()
    req.session.destroy()
    res.redirect('/login')
  }

  controller.exibeEsqueci = function (req, res) {
    res.render('forgot-password', { message: req.flash('message') })
  }

  controller.exibeResetar = function (req, res) {
    res.render('reset-password', { messagereset: req.flash('messagereset') })
  }

  controller.esqueciSenha = function (req, res) {
    var fullUrl = req.protocol + '://' + req.hostname + (process.env.PORT == 80 || process.env.PORT == 443 ? '' : ':' + process.env.PORT);
    async.waterfall([
      function (done) {
        User.findOne({
          email: req.body.email
        }).exec(function (err, user) {
          if (user) {
            done(err, user);
          } else {
            req.flash('message', 'Nenhum usuário encontrado com esse email!')
            res.redirect('/esqueciminhasenha');
          }
        });
      },
      function (user, done) {
        // create the random token
        crypto.randomBytes(20, function (err, buffer) {
          var token = buffer.toString('hex');
          done(err, user, token);
        });
      },
      function (user, token, done) {
        User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function (err, new_user) {
          done(err, token, new_user);
        });
      },
      function (token, user, done) {
        var data = {
          to: user.email,
          from: process.env.MAILER_EMAIL_ID,
          template: 'forgot-password-email',
          subject: 'A ajuda da senha chegou!',
          context: {
            url: fullUrl + '/resetarsenha?token=' + token,
            name: user.nome,
            domain: fullUrl,
            nomesite: 'Eja - Matemática'
          }
        };

        smtpTransport.sendMail(data, function (err) {
          if (!err) {
            req.flash('message', 'Foi enviado para seu email o link para resetar a senha!')
            return res.redirect('/esqueciminhasenha');
          } else {
            console.log(err)
            req.flash('message', 'Algo está errado. Tente mais tarde.')
            return res.redirect('/esqueciminhasenha');
          }
        });
      }
    ], function (err) {
      console.log(err)
      res.status(500).json(err)
    });
  }

  controller.resetasenha = function (req, res) {
    var fullUrl = req.protocol + '://' + req.hostname + (process.env.PORT == 80 || process.env.PORT == 443 ? '' : ':' + process.env.PORT);
    User.findOne({
      reset_password_token: req.body.token,
      reset_password_expires: {
        $gt: Date.now()
      }
    }).exec(function (err, user) {
      if (!err && user) {
        if (req.body.senha === req.body.confsenha) {
          user.senha = bcrypt.hashSync(req.body.senha, bcrypt.genSaltSync(8), null)
          user.reset_password_token = undefined;
          user.reset_password_expires = undefined;
          user.save(function (err) {
            if (err) {
              req.flash('messagereset', 'Algo está errado. Tente novamente mais tarde.')
              res.redirect('/resetarsenha?token=' + req.body.token)
            } else {
              var data = {
                to: user.email,
                from: process.env.MAILER_EMAIL_ID,
                template: 'reset-password-email',
                subject: 'Confirmaçãoi de redefinição de senha',
                context: {
                  name: user.nome,
                  domain: fullUrl,
                  nomesite: 'Eja - Matemática'
                }
              };

              smtpTransport.sendMail(data, function (err) {
                if (!err) {
                  req.flash('messagereset', 'Senha Resetada. Favor fazer login agora.')
                  res.redirect('/resetarsenha')
                } else {
                  req.flash('messagereset', 'Algo está errado. Tente novamente mais tarde.')
                  res.redirect('/resetarsenha?token=' + req.body.token)
                }
              });
            }
          });
        } else {
          req.flash('messagereset', 'As senhas não conferem!')
          res.redirect('/resetarsenha?token=' + req.body.token)
        }
      } else {
        req.flash('messagereset', 'Token de resetar a senha é inválido ou expirou.')
        res.redirect('/resetarsenha?token=' + req.body.token)
      }
    });
  }


  return controller
}
