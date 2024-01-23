import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

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
  const contactIndex = contacts.findIndex((el) => el.id === contactId);

  if (contactIndex === -1) {
    return null;
  }

  const updatedContact = contacts.find((el) => el.id === contactId);
  contacts[contactIndex] = { contactId, ...updatedContact, ...updatedFields };

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return contacts[contactIndex];
}



export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};