var mongoose = require('mongoose')
module.exports = function () {
  var schema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    nome: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    professor:{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    conteudo:{ type: mongoose.Schema.Types.ObjectId, ref: 'Conteudo' }
  })


  return mongoose.model('Video', schema)
}
