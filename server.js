var http = require('http');
var config = require('./config/config')();
var app = require('./config/express')(config);

require('./config/passport')();
require('./config/database')(config.db);

http.createServer(app).listen(app.get('port'), app.get('address'),function(){
  console.log('Express Server escutando na porta ' + app.get('port'));
});
