const Joi = require('joi')

const addSchema = Joi.object({
  name: Joi.string().required().min(3).max(30).messages({
    'any.required': 'missing required name field',
  }),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
    })
    .messages({
      'any.required': 'missing required e-mail field',
    }),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9 ()-]+$/)
    .messages({
      'string.pattern.base': 'Phone number must be in format 380000000000',
      'any.required': 'missing required phone field',
    }),
})

module.exports = {
  addSchema,
}
