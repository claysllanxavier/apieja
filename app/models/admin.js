var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
module.exports = function () {
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
    senha: {
      type: String,
      required: true
    },
    atualizado: {
      type: Date,
      default: Date.now
    }
  })

  schema.methods.generateHash = function (senha) {
    return bcrypt.hashSync(senha, bcrypt.genSaltSync(8), null)
  }
  
  schema.methods.validPassword = function (senha) {
    return bcrypt.compareSync(senha, this.senha)
  }


  return mongoose.model('Admin', schema)
}
