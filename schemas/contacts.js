const Joi = require('joi')

const addSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
  }),
  phone: Joi.string().pattern(/^[0-9 ()-]+$/),
})

module.exports = {
  addSchema,
}
