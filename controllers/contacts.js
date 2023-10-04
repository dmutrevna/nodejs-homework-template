const { Contact } = require('../models/contact')

const { HttpError, ctrlWrapper } = require('../helpers')

const getAll = async (req, res) => {
  const result = await Contact.find()
  res.json(result)
}

const getById = async (req, res) => {
  const { id } = req.params
  const result = await Contact.findById(id)
  if (!result) {
    throw HttpError(404, 'Not Found')
  }
  res.json(result)
}

const add = async (req, res) => {
  const { name, email, phone } = req.body

  const validData = { name, email, phone }

  const result = await Contact.create(req.body)
  if (!result) {
    throw HttpError(400, `message: missing required ${validData} field`)
  }
  res.status(201).json(result)
}

const updateById = async (req, res) => {
  const { id } = req.params

  const result = await Contact.findByIdAndUpdate(id, req.body)

  if (!result) {
    return res.status(404).json({ message: 'Not found' })
  }

  res.json(result)
}

const deleteContactById = async (req, res) => {
  const { id } = req.params
  const result = await Contact.findByIdAndDelete(id)
  if (!result) {
    throw HttpError(404, 'Not found')
  }
  res.json({
    message: 'contact deleted',
  })
}

const updateStatusContact = async (req, res) => {
  const { favorite } = req.body

  if (favorite === undefined || favorite === null) {
    throw HttpError(400, 'Missing field favorite')
  }

  const { id } = req.params
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true })
  if (!result) {
    throw HttpError(404, 'Not found')
  }
  res.json(result)
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteContactById: ctrlWrapper(deleteContactById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
}
