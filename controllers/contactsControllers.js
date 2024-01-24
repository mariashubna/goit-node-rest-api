import * as contactsService from "../services/contactsServices.js";
import { HttpError } from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.status(200).json(contacts);
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);

    if (!contact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);

    if (!deletedContact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = [
  validateBody(createContactSchema),
  async (req, res, next) => {
    try {
      const { name, email, phone } = req.body;
      const newContact = await contactsService.addContact(
        name,
        email,
        phone,
      );
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  },
];

export const updateContact = [
  validateBody(updateContactSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;
      const updatedContact = await contactsService.updateContact(id, {
        name,
        email,
        phone,
      });

      if (!updatedContact) {
        throw HttpError(404, "Not found");
      }

      

      res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  },
];
