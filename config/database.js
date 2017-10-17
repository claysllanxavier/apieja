var mongoose = require('mongoose');
module.exports = function() {
  mongoose.connect(process.env.DB, {useMongoClient: true});
  //mongoose.set('debug',true);
  mongoose.connection.on('connected', function() {
    console.log('Mongoose! Conectado em ' + process.env.DB);
  });
  mongoose.connection.on('disconnected', function() {
    console.log('Mongoose! Desconectado de ' + process.env.DB);
  });
  mongoose.connection.on('error', function(erro) {
    console.log('Mongoose! Erro na conexão: ' + erro);
  });
  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      console.log('Mongoose! Desconectado pelo término da aplicação');
      // 0 indica que a finalização ocorreu sem erros
      process.exit(0);
    });
  });
}
