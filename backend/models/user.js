const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true ,
    },
  passwordHash: String
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = model('User', userSchema,'users')

module.exports = User