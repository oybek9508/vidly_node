const mongoose = require('mongoose')
const express = require('express')
const auth = require('../middleware/auth')
const { Users, validate } = require('../models/users')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const router = express.Router()
const config = require('config')
const jwt = require('jsonwebtoken')

// router.get('/', async (req, res) => {
//   const user = await Users.find()
//   if (!user) return res.status(400).send('No user found')
//   res.send(user)
// })

router.get('/me', auth, async (req, res) => {
  const user = await Users.findById(req.user._id).select('-password')
  res.send(user)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  // checking if the user with the email already registered or not
  let user = await Users.findOne({ email: req.body.email })
  if (user) return res.status(400).send('The user already exists')

  const { name, email, password } = req.body
  user = new Users({
    name,
    email,
    password,
  })
  // hashing the password
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)

  await user.save()
  const token = user.generateAuthToken()
  // when directly logging in after registering
  res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']))
})

module.exports = router
