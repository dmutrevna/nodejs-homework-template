const { Schema, model } = require('mongoose')
const { handleMongooseError } = require('../helpers')

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Missing required name field'],
      minlength: [3, 'Name should be at least 3 characters'],
      maxlength: [30, 'Name should not exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Missing required email field'],
      validate: {
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message:
          'Invalid email format. The email should have the format user@example.com',
      },
    },
    phone: {
      type: String,
      required: [true, 'Missing required phone field'],
      match: [/^[0-9 ()-]+$/, 'Phone number must be in format 380000000000'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
)

contactSchema.post('save', handleMongooseError)

const Contact = model('contact', contactSchema)

module.exports = { Contact }
