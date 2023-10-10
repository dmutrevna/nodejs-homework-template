const { Schema, model } = require('mongoose')
const { handleMongooseError, runValidatorsAtUpdate } = require('./hooks.js')

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Missing required name field'],
      minlength: [3, 'Name should be at least 3 characters'],
      maxlength: [30, 'Name should not exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Missing required email field'],
      unique: true,
      validate: {
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message:
          'Invalid email format. The email should have the format user@example.com',
      },
    },
    password: {
      type: String,
      required: [true, 'Missing required password field'],
      minlength: [6, 'Password should be at least 6 characters'],
      validate: {
        validator: function (value) {
          return /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/.test(value)
        },
        message:
          'Password should contain letters and at least one special character (!@#$%^&*)',
      },
    },
  },
  { versionKey: false, timestamps: true }
)

userSchema.post('save', handleMongooseError)

userSchema.pre('findOneAndUpdate', runValidatorsAtUpdate)

userSchema.post('findOneAndUpdate', handleMongooseError)

const User = model('user', userSchema)

module.exports = { User }
