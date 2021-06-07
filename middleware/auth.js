const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token')
  if (!token) return res.status(401).send('Access denied. No token provided')

  // this jwt.veridy verifies the token, if it is valid, it returns the decoded token
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'))
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).send('Invalid token.')
  }
}
