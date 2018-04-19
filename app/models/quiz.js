var mongoose = require('mongoose')
module.exports = function () {

  var schema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    pergunta: {
      type: String,
      required: true,
      trim: true
    },
    respostas: [String],
    respostaCerta: {
      type: String,
      required: true,
      trim: true
    },
    atualizado: {
      type: Date,
      default: Date.now
    },
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    conteudo: { type: mongoose.Schema.Types.ObjectId, ref: 'Conteudo' }
  })


  return mongoose.model('Quiz', schema)
}
