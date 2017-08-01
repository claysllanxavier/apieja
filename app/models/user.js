var mongoose = require('mongoose');
module.exports = function() {
  var schema = mongoose.Schema({
    nome: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: {
        unique: true
      }
    },
    escola: {
      type: String,
      trim: true,
      required: true
    },
    tipoEscola: {
      type: String,
      trim: true,
      required: true
    },
    senha: {
      type: String,
      required: true
    },
    sexo: {
      type: String,
      trim: true,
      required: true
    },
    atualizado: {
      type: Date,
      default: Date.now
    }
  });
  return mongoose.model('User', schema);
};
