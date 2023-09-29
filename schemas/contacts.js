const Joi = require('joi')

const addSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  email: Joi.string().required().email({
    minDomainSegments: 2,
  }),
  phone: Joi.string()
    .required()
    .pattern(/^[0-9 ()-]+$/),
})

module.exports = {
  addSchema,
}
