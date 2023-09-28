const Joi = require('joi')

const addSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9]+$/),
})

module.exports = {
  addSchema,
}
