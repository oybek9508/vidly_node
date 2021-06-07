const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const Joi = require('joi')
const bcrypt = require('bcrypt')

const { Users } = require('../models/users')

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(404).send(error.details[0].message)

  const user = await Users.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Invalid email or password')

  // compare the hashed password with the password user inputs and then return the valid or invalid Password
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid email or password')

  const token = user.generateAuthToken()

  res.send(token)
})

const validate = (login) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(5).max(255).required(),
  })
  return login
}
module.exports = router
