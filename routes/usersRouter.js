import express from "express";

import validateBody from "../helpers/validateBody.js";
import authenticate from "../helpers/authenticate.js";
import {updateSubscriptionSchema, createUserSchema, } from "../schemas/usersSchemas.js";
import {
  register,
  login,
  logout,
  current,
  updateSubscription,
  newAvatar,
} from "../controllers/usersControllers.js";
import upload from "../helpers/upload.js"

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(createUserSchema), register);
usersRouter.post("/login", validateBody(createUserSchema), login);
usersRouter.post("/logout", authenticate, logout);
usersRouter.get("/current", authenticate, current);
usersRouter.patch("/", authenticate, validateBody(updateSubscriptionSchema), updateSubscription);
usersRouter.patch("/avatars", authenticate, upload.single("avatarURL"), newAvatar);

export default usersRouter;