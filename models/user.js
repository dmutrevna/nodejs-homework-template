const { Schema, model } = require('mongoose')
const { handleMongooseError, runValidatorsAtUpdate } = require('./hooks.js')

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message:
          'Invalid email format. The email should have the format user@example.com',
      },
    },
    password: {
      type: String,
      required: [true, 'Set password for user'],
      minlength: [6, 'Password should be at least 6 characters'],
      validate: {
        validator: function (value) {
          return /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/.test(value)
        },
        message:
          'Password should contain letters and at least one special character (!@#$%^&*)',
      },
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    avatarURL: {
      type: String,
    },
    token: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
)

userSchema.post('save', handleMongooseError)

userSchema.pre('findOneAndUpdate', runValidatorsAtUpdate)

userSchema.post('findOneAndUpdate', handleMongooseError)

const User = model('user', userSchema)

module.exports = { User }
