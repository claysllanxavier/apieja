var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

module.exports = function() {
  var Respostas = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    pergunta: {
      type: String,
      required: true,
      trim: true
    },
    respostaUsuario: {
      type: String,
      required: true,
      trim: true
    },
    respostaCerta: {
      type: String,
      required: true,
      trim: true
    },
    acertou: {type: Boolean},
    atualizado: { type: Date, default: Date.now}
  });

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
    senha: {
      type: String,
      required: true
    },
    respostas  : [Respostas],
    atualizado: {
      type: Date,
      default: Date.now
    }
  });

  schema.methods.generateHash = function(senha) {
    return bcrypt.hashSync(senha, bcrypt.genSaltSync(8), null);
  };

  schema.methods.validPassword = function(senha, pass) {
    return bcrypt.compareSync(senha, pass);
  };

  return mongoose.model('User', schema);
};
