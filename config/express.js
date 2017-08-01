var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var compression = require('compression');


module.exports = function() {
  var app = express();
  // variável de ambiente
  app.set('port', 8080);
  // middlewares
  app.use(express.static('./public'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(require('method-override')())
  app.set('view engine', 'ejs');
  app.set('views','./app/views');
  app.use(helmet());
  app.use(compression());

  load('models', {cwd: 'app'})
  .then('controllers')
  .then('routes')
  .into(app);

  app.get('*', function(req, res) {
    res.status(404).render('404');
  });
  return app;
};
