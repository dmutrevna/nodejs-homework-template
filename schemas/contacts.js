const Joi = require('joi')

const addSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
    })
    .messages({
      'string.email': 'message: missing required name field',
    }),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9 ()-]+$/)
    .messages({
      'string.pattern.base': 'Phone number must be in format 380000000000',
    }),
})

module.exports = {
  addSchema,
}
