var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var timestamps = require('mongoose-timestamp');
module.exports = function () {
  var Respostas = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    idconteudo: mongoose.Schema.Types.ObjectId,
    idpergunta: mongoose.Schema.Types.ObjectId,
    acertou: {type: Boolean},
    atualizado: { type: Date, default: Date.now}
  })

  Respostas.plugin(timestamps);

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
    respostas: [Respostas],
    pontos: Number,
    qtdperguntas: Number,
    qtdacertos: Number,
    atualizado: {
      type: Date,
      default: Date.now
    }
  })

  schema.methods.generateHash = function (senha) {
    return bcrypt.hashSync(senha, bcrypt.genSaltSync(8), null)
  }

  schema.methods.validPassword = function (senha, pass) {
    return bcrypt.compareSync(senha, pass)
  }
  schema.plugin(timestamps);

  return mongoose.model('User', schema)
}
