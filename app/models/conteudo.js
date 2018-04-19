var mongoose = require('mongoose')
module.exports = function () {
  var Conteudo = mongoose.Schema({
    conteudo: {
      type: String,
      required: true,
      trim: true
    },
    informacao: {
      type: String,
      required: true,
      trim: true
    },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    perguntas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
    atualizado: {
      type: Date,
      default: Date.now
    }
  })
  return mongoose.model('Conteudo', Conteudo)
}
