require('dotenv').config()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs/promises')
const path = require('path')
const gravatar = require('gravatar')
const Jimp = require('jimp')
const { nanoid } = require('nanoid')

const { User } = require('../models/user')
const { HttpError, ctrlWrapper, sendMail } = require('../helpers')

const { JWT_SECRET, BASE_URL } = process.env

const avatarsPath = path.resolve('public', 'avatars')

const register = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (user) {
    throw HttpError(409, `${email} already in use`)
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const avatarURL = gravatar.url(email)
  const verificationCode = nanoid()

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  })

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click to verify email</a>`,
  }
  await sendMail(verifyEmail)

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  })
}

const verify = async (req, res) => {
  const { verificationCode } = req.params
  const user = await User.findOne({ verificationCode })
  if (!user) {
    throw HttpError(404)
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: '' })

  res.json({
    message: 'Verify success',
  })
}

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw HttpError(404, 'Email not found')
  }
  if (user.verify) {
    throw HttpError(400, 'Email already verify')
  }

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click to verify email</a>`,
  }
  await sendMail(verifyEmail)

  res.json({
    message: 'Verify email send',
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

  if (!user.verify) {
    throw HttpError(401, 'Email not verify')
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

const updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user
    const { path: tmpUpload, originalname } = req.file
    const fileName = `${_id}_${originalname}`
    const resultUpload = path.join(avatarsPath, fileName)
    await fs.rename(tmpUpload, resultUpload)

    const avatarURL = path.join('avatars', fileName)

    Jimp.read(resultUpload, (err, lenna) => {
      if (err) throw err.message
      lenna.resize(250, 250).write(resultUpload)
    })

    await User.findByIdAndUpdate(_id, { avatarURL })

    res.json({ avatarURL })
  } catch (error) {
    await fs.unlink(req.file.path)
    throw error
  }
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  updateStatusUser: ctrlWrapper(updateStatusUser),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
}
