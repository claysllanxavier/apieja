var mongoose = require('mongoose');
module.exports = function() {
  var Respostas = mongoose.Schema({
    alternativa: {
      type: String,
      required: true,
      trim: true
    }
  });

  var Quiz = mongoose.Schema({
    pergunta: {
      type: String,
      required: true,
      trim: true
    },
    respostas  : [Respostas],
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

  return mongoose.model('Quiz', Quiz);
};
