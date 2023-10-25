const nodemailer = require('nodemailer')
require('dotenv').config()

const { UKR_NET_PASSWORD, UKR_NET_EMAIL } = process.env

const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
}

const transport = nodemailer.createTransport(nodemailerConfig)

const sendMail = async (data) => {
  await transport
    .sendMail({ ...data, from: UKR_NET_EMAIL })
    .then(() => console.log('Email send success'))
    .catch((error) => console.log(error.message))
  return true
}

module.exports = sendMail
