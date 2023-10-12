const express = require('express')
const authCtrl = require('../../controllers/auth')
const { validateBody, authenticate, isValidId } = require('../../middlewares')
const { userSignupSchema, userSigninSchema } = require('../../schemas/user')

const userSignupValidate = validateBody(userSignupSchema)
const userSigninValidate = validateBody(userSigninSchema)

const authRouter = express.Router()

authRouter.post('/register', userSignupValidate, authCtrl.register)
authRouter.post('/login', userSigninValidate, authCtrl.login)
authRouter.post('/logout', authenticate, authCtrl.logout)
authRouter.get('/current', authenticate, authCtrl.current)
authRouter.patch('/:id/subscription', isValidId, authCtrl.updateStatusUser)

module.exports = authRouter
