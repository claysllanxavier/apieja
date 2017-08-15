var mongoose = require('mongoose');
module.exports = function() {
  var Quiz = mongoose.Schema({
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

  return mongoose.model('Quiz', Quiz);
};
