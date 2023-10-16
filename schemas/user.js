const Joi = require('joi')

const userSignupSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
    })
    .messages({
      'any.required': 'missing required email field',
    }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'missing required password field',
  }),
})

const userSigninSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
    })
    .messages({
      'any.required': 'missing required email field',
    }),
  password: Joi.string().min(6).required(),
})

module.exports = {
  userSignupSchema,
  userSigninSchema,
}
