require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User } = require('../models/user')
const { HttpError, ctrlWrapper } = require('../helpers')

const { JWT_SECRET } = process.env

const register = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    throw HttpError(409, `${email} already in use`)
  }

  const hashPassword = await bcrypt.hash(password, 10)

  const newUser = await User.create({ ...req.body, password: hashPassword })
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  })
}

const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw HttpError(401, `Email or password invalid`)
  }

  const passwordCompare = await bcrypt.compare(password, user.password)
  if (!passwordCompare) {
    throw HttpError(401, `Email or password is wrong`)
  }

  const payload = {
    id: user._id,
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' })
  await User.findByIdAndUpdate(user._id, { token })
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  })
}

const current = async (req, res) => {
  const { subscription, email } = req.user

  res.json({
    email,
    subscription,
  })
}

const logout = async (req, res) => {
  const { _id } = req.user
  await User.findByIdAndUpdate(_id, { token: '' })

  res.json({
    message: 'Logout success',
  })
}

const updateStatusUser = async (req, res) => {
  const { subscription } = req.body
  const { _id: id } = req.user

  const updatedUser = await User.findOneAndUpdate(
    id,
    { subscription },
    { new: true }
  )

  if (!updatedUser) {
    throw HttpError(404, 'User not found')
  }

  const message = `Subscription status updated to ${updatedUser.subscription}`
  res.json({
    message: message,
    email: updatedUser.email,
  })
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateStatusUser: ctrlWrapper(updateStatusUser),
}
