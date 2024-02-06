import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavoriteStatus,
} from "../controllers/contactsControllers.js";

import validateBody  from "../helpers/validateBody.js";
import isIdValid from "../helpers/isValidId.js";
import {
  createContactSchema,
  updateContactSchema,
  favoriteContactSchema,
} from '../schemas/contactsSchemas.js'

import authenticate from "../helpers/authenticate.js";


const contactsRouter = express.Router();

contactsRouter.use("/:id*", authenticate, isIdValid());

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", authenticate, deleteContact);

contactsRouter.post("/", authenticate, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", authenticate, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", authenticate, validateBody(favoriteContactSchema), updateFavoriteStatus);

export default contactsRouter;
