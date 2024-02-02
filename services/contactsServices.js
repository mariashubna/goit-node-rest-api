import Contact from "../models/model.js";

async function listContacts() {
  const contactsList = await Contact.find();
  return contactsList;
}

async function getContactById(contactId) {
  const contactById = await Contact.findById(contactId);
  return contactById || null;
}

async function removeContact(contactId) {
  const contactById = await getContactById(contactId);
  await Contact.findByIdAndDelete(contactId);
  return contactById || null;
}

async function addContact(name, email, phone) {
  const newContact = await Contact.create({ name, email, phone });
  return newContact;
}

async function updateContact(contactId, updatedFields) {
  const changedContact = await Contact.findByIdAndUpdate(
    contactId,
    updatedFields,
    {
      new: true,
    }
  );
  return changedContact || null;
}

async function updateStatusContact(contactId, data) {
  const changedContact = await Contact.findByIdAndUpdate(contactId, data, {
    new: true,
  });
  return changedContact || null;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
