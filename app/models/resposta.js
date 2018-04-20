var mongoose = require('mongoose')
module.exports = function () {

  var schema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    conteudo: { type: mongoose.Schema.Types.ObjectId, ref: 'Conteudo' },
    pergunta: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    acertou: { type: Boolean },
    atualizado: { type: Date, default: Date.now },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  })


  return mongoose.model('Resposta', schema)
}
