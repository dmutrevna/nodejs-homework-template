const contacts = require('../models/contacts')

const { HttpError, ctrlWrapper } = require('../helpers')

const getAll = async (req, res) => {
  const result = await contacts.listContacts()
  res.json(result)
}

const getById = async (req, res) => {
  const { id } = req.params
  const result = await contacts.getContactById(id)
  if (!result) {
    throw HttpError(404, 'Not Found')
  }
  res.json(result)
}

const add = async (req, res) => {
  const result = await contacts.addContact(req.body)
  if (!result) {
    throw HttpError(400, `message": "missing required name field"`)
  }
  res.status(201).json(result)
}

const updateById = async (req, res) => {
  const { id } = req.params
  if (!req.body) {
    return res.status(400).json({ message: 'missing fields' })
  }
  const result = await contacts.updateContactById(id, req.body)
  if (!result) {
    throw HttpError(404, 'message": "missing fields')
  }
  res.json(result)
}

const deleteContactById = async (req, res) => {
  const { id } = req.params
  const result = await contacts.removeContact(id)
  if (!result) {
    throw HttpError(404, 'message": "contact deleted')
  }
  res.json({
    message: 'Delete success',
  })
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteContactById: ctrlWrapper(deleteContactById),
}
