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


const contactsRouter = express.Router();

contactsRouter.use("/:id*", isIdValid());

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", validateBody(favoriteContactSchema), updateFavoriteStatus);

export default contactsRouter;
