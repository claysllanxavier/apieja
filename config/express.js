var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var helmet = require('helmet');
var compression = require('compression');
var port     = process.env.PORT || 8000;
var passport = require('passport');
var morgan       = require('morgan');
var flash    = require('connect-flash');


module.exports = function() {
  var app = express();
  // variável de ambiente
  app.set('port', 8000);
  // middlewares
  app.use(morgan('dev'));
  app.use(express.static('./public'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(require('method-override')())
  app.set('view engine', 'ejs');
  app.set('views','./app/views');
  app.use(helmet());
  app.use(compression());



  // required for passport
  app.use(cookieParser());
  app.use(session(
    {
      secret: 'ilovescotchscotchyscotchscotch',
      proxy: true,
      resave: true,
      saveUninitialized: true
    })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash());

    load('models', {cwd: 'app'})
    .then('controllers')
    .then('routes')
    .into(app);

    app.get('*', function(req, res) {
      res.status(404).render('404');
    });

    return app;
  };
