const express = require('express')
const authCtrl = require('../../controllers/auth')
const { validateBody, authenticate, upload } = require('../../middlewares')
const {
  userSignupSchema,
  userSigninSchema,
  userEmailSchema,
} = require('../../schemas/user')

const userSignupValidate = validateBody(userSignupSchema)
const userSigninValidate = validateBody(userSigninSchema)
const userEmailValidate = validateBody(userEmailSchema)

const authRouter = express.Router()

authRouter.post('/register', userSignupValidate, authCtrl.register)
authRouter.get('/verify/:verificationToken', authCtrl.verify)
authRouter.post('/verify', userEmailValidate, authCtrl.resendVerifyEmail)
authRouter.post('/login', userSigninValidate, authCtrl.login)
authRouter.post('/logout', authenticate, authCtrl.logout)
authRouter.get('/current', authenticate, authCtrl.current)
authRouter.patch('/', authenticate, authCtrl.updateStatusUser)
authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  authCtrl.updateAvatar
)

module.exports = authRouter
