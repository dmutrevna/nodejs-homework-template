const express = require('express')
const authCtrl = require('../../controllers/auth')
const { validateBody, isValidId } = require('../../middlewares')
const { userSignupSchema, userSigninSchema } = require('../../schemas/user')

const userSignupValidate = validateBody(userSignupSchema)

const authRouter = express.Router()

authRouter.post('/signup', validateBody, userSignupValidate, authCtrl.signup)

module.exports = authRouter
