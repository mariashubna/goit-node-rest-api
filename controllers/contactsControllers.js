import Contact from '../models/contact.js';
import { HttpError } from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";
import isIdValid from '../helpers/isValidId.js';
import { updateContactSchema } from '../schemas/contactsSchemas.js'

export const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 5, favorite } = req.query;
    const { _id: owner } = req.user;
    const skip = (page - 1) * limit;

    let query = { owner };

    if (favorite !== undefined) {
      query.favorite = favorite === "true";
    }

    const totalContacts = await Contact.countDocuments(query);

    const contacts = await Contact.find(query, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "email");
    res.status(200).json({
      total: totalContacts,
      perPage: limit,
      currentPage: page,
      contacts: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    isIdValid(id);

    const { _id: owner } = req.user;
    const contact = await Contact.findById(id).where("owner").equals(owner);

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
    isIdValid(id);
    
    const { _id: owner } = req.user;
    const deletedContact = await Contact.findByIdAndDelete(id)
      .where("owner")
      .equals(owner);

    if (!deletedContact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
      const { _id: owner } = req.user;
      const newContact = await Contact.create({ ...req.body, owner });
      res.status(201).json(newContact);
    } catch (error) {
      next(error);
    }
  };

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    validateBody(updateContactSchema);

    const { _id: owner } = req.user;

    if (Object.keys(req.body).length === 0)
      throw HttpError(400, "Body must have at least one field");

    const updatedContact = await Contact.findByIdAndUpdate(id, updates, {
      new: true,
    })
      .where("owner")
      .equals(owner);

      if (!updatedContact) {
        throw HttpError(404, "Not found");
      }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateFavoriteStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const { _id: owner } = req.user;

    const updatedContact = await Contact.findByIdAndUpdate(id, { favorite }, {
      new: true,
    })
      .where("owner")
      .equals(owner);

      if (!updatedContact) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
