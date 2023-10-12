const jwt = require('jsonwebtoken')
require('dotenv').config()

const { User } = require('../models/user')
const { HttpError, ctrlWrapper } = require('../helpers')
const { JWT_SECRET } = process.env

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers
  const [bearer, token] = authorization.split(' ')
  if (bearer !== 'Bearer') {
    throw HttpError(401)
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET)

    const user = await User.findById(id)
    if (!user || !user.token) {
      throw HttpError(401)
    }
    req.user = user
    next()
  } catch (error) {
    next(HttpError(401))
  }
}

module.exports = ctrlWrapper(authenticate)
