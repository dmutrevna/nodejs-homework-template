const fs = require('fs/promises')
const path = require('path')
const { nanoid } = require('nanoid')

const contactsPath = path.join(__dirname, 'contacts.json')

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath)
  return JSON.parse(contacts)
}

const getContactById = async (id) => {
  const contacts = await listContacts()

  const resultContact = contacts.find((contact) => contact.id === id)

  return resultContact || null
}

const removeContact = async (id) => {
  const contacts = await listContacts()
  const index = contacts.findIndex((contact) => contact.id === id)
  if (index === -1) {
    return null
  }
  const [result] = contacts.splice(index, 1)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return result
}

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts()
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  }
  contacts.push(newContact)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return newContact
}

const updateContactById = async (id, data) => {
  const contacts = await listContacts()
  const index = contacts.findIndex((contact) => contact.id === id)

  if (index === -1) {
    return null
  }

  contacts[index] = { id: id, ...data }
  await updateContactById(contacts)
  return contacts[index]
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContact,
}
