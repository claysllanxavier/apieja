var mongoose = require('mongoose');
module.exports = function() {
  var Videos = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    nome: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: {
        unique: true
      }
    }
  });

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
    videos  : [Videos],
    atualizado: {
      type: Date,
      default: Date.now
    }
  });

  return mongoose.model('Conteudo', Conteudo);
};
