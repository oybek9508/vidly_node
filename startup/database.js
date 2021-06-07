const mongoose = require('mongoose')
const winston = require('winston')
module.exports = () => {
  mongoose
    .connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
}
