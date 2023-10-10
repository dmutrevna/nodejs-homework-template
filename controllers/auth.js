const { User } = require('../models/user')
const { HttpError, ctrlWrapper } = require('../helpers')

const signup = async (req, res) => {
  const user = await User.create(req.body)
  res.status(201).join({
    username: user.username,
    email: user.email,
  })
}

module.exports = {
  signup: ctrlWrapper(signup),
}
