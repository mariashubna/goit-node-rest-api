import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import Contact from '../models/model.js';

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const buffer = await fs.readFile(contactsPath);
  const contactsList = JSON.parse(buffer)
  return contactsList;
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contactById = contacts.find(({ id }) => id === contactId);
  return contactById || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const contactById = await getContactById(contactId);
  const removeContact = contacts.filter(({ id }) => id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(removeContact, null, 2));
  return contactById || null;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  const updatedList = [...contacts, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(updatedList, null, 2));
  return newContact;
}

async function updateContact(contactId, updatedFields) {
  const contacts = await listContacts();
  const contactById = contacts.find(({ id }) => id === contactId);
  if (!contactById) return null;

  const changedContact = {
    id: contactId,
    name: updatedFields.name || contactById.name,
    email: updatedFields.email || contactById.email,
    phone: updatedFields.phone || contactById.phone,
  };
  const updatedContacts = [
    ...contacts.filter(({ id }) => id !== contactId),
    changedContact,
  ];
  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
  return changedContact;
}

async function updateFavoriteStatus(contactId, favorite) {
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return null;
  }

  contact.favorite = favorite;
  await contact.save();

  return contact;
}


export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavoriteStatus,
};