import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import { HttpError } from "../helpers/HttpError.js";
import User from "../models/user.js";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import sendEmail from '../helpers/sendEmail.js'


const { SECRET_KEY, BASE_URL } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    const usedEmail = await User.findOne({ email });

    if (usedEmail) throw HttpError(409, "Email in use");

    const { password } = req.body;
   
    const hashPassword = await bcrypt.hash(password, 10);
    
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();


    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken, });
    
    const verifyEmail = {
      to: [email],
      subject: "Verify your email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click here to verify email</a>`,
    };

    await sendEmail(verifyEmail);


    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUsersEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) throw HttpError(404, "User not found");

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.status(200).json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw HttpError(404, "User not found");

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
      

    const verifyEmail = {
      to: email,
      subject: "Verify your email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click here to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(200).json({
      message: "Verification email sent",
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

    if (!user.verify) throw HttpError(401, "Email isn't verified");

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
        avatarURL: loggedUser.avatarURL,
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
    const { email, subscription, avatarURL } = req.user;
    res.status(200).json({ email, subscription, avatarURL });
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

export const newAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;

    if (!req.file) throw Error("Avatar needs to be added");

    const { path: tempUpload, originalname } = req.file;

    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.join("public", "avatars", fileName);

    const avatar = await Jimp.read(tempUpload);
    avatar.resize(250, 250).write(resultUpload);
    await fs.rename(tempUpload, resultUpload);

    await User.findByIdAndUpdate(_id, { avatarURL: resultUpload });

    const visibleURL = path.join("avatars", fileName);

    res.status(200).json({ avatarURL: visibleURL });
  } catch (error) {
    next(error);
  }
};
