const Joi = require('joi')
const mongoose = require('mongoose')
const config = require('config')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 25,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 1024,
  },
  isAdmin: Boolean,
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwtPrivateKey')
  )
  return token
}
const Users = mongoose.model('Users', userSchema)

const validateUsers = (users) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(25).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(5).max(255).required(),
  })
  return schema.validate(users)
}

exports.Users = Users
exports.validate = validateUsers
