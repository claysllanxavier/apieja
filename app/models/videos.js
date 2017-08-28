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
      trim: true
    }
  });

  var Quiz = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    pergunta: {
      type: String,
      required: true,
      trim: true
    },
    respostas  : [String],
    atualizado: {
      type: Date,
      default: Date.now
    },
    respostaCerta: {
      type: String,
      required: true,
      trim: true
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
    perguntas  : [Quiz],
    atualizado: {
      type: Date,
      default: Date.now
    }
  });

  return mongoose.model('Conteudo', Conteudo);
};
