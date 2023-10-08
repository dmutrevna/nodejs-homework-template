const mongoose = require('mongoose')
const { HttpError } = require('../helpers')

const isValidId = (req, res, next) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    next(HttpError(400, `${id} is not a valid id`))
    return
  }
  next()
}

module.exports = isValidId
