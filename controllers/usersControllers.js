import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";

import { HttpError } from "../helpers/HttpError.js";
import User from "../models/user.js";

const { SECRET_KEY } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const usedEmail = await User.findOne({ email });

    if (usedEmail) throw HttpError(409, "Email in use");

    const { password, ...userData } = req.body;
   
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    const enteredUser = await User.findOne({ email });

    if (!enteredUser) throw HttpError(401, "Email or password is wrong");

    const passwordIsValid = await bcrypt.compare(
      password,
      enteredUser.password
    );

    if (!passwordIsValid) {
        throw HttpError(401, "Email or password is wrong");
      }

    const payload = { id: enteredUser._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

    const loggedUser = await User.findByIdAndUpdate(
        enteredUser._id,
      { token: token },
      { new: true, }
    );

    res.status(200).json({
      token: loggedUser.token,
      user: {
        email: loggedUser.email,
        subscription: loggedUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({ email, subscription });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;
    await User.findByIdAndUpdate(_id, { subscription: subscription });

    res.status(200).json({ subscription, message: "Subscription successfully changed" });
  } catch (error) {
    next(error);
  }
};