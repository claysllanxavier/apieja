var express = require('express')
var load = require('express-load')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var helmet = require('helmet')
var compression = require('compression')
var passport = require('passport')
var morgan = require('morgan')
var flash = require('connect-flash')

module.exports = function (config) {
  var app = express()
  // variável de ambiente
  app.set('port', process.env.PORT)

  app.engine('html', require('ejs').renderFile);

  // middlewares
  if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
  }
  app.use(express.static('./public'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use(require('method-override')())
  app.set('view engine', 'html')
  app.set('views', './app/views')
  app.use(helmet())
  app.use(compression())

  app.options('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*')
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token')
    res.status(200).end()
  })

  // required for passport
  app.use(cookieParser())
  app.use(session(
    {
      secret: process.env.SECRET,
      proxy: true,
      resave: true,
      saveUninitialized: true
    })) // session secret
    app.use(passport.initialize())
    app.use(passport.session()) // persistent login sessions
    app.use(flash())

    load('models', {cwd: 'app'})
    .then('controllers')
    .then('routes')
    .into(app)

    app.get('*', function (req, res) {
      if(typeof req.user === 'undefined'){
        res.status(404).render('404')
      } else{
        res.render('index',{
          usuarioLogado: req.user.nome,
          usuarioEmail: req.user.email
        });
      }
    })

    app.use(function (error, req, res, next) {
      console.log(error)
      res.status(500).render('500')
    })

    return app
  }
