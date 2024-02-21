import Joi from "joi";
import { SUBSCRIPTION_OPTIONS } from "../models/user.js";

export const createUserSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().min(6).max(20).required(),
  subscription: Joi.string().valid(...SUBSCRIPTION_OPTIONS),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...SUBSCRIPTION_OPTIONS)
    .required(),
});

export const verifySchema = Joi.object({
  email: Joi.string()
  .email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  })
    .required(),
});