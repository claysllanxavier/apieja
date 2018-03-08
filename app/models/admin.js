var mongoose = require('mongoose')
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
  
  return mongoose.model('Admin', schema)
}
