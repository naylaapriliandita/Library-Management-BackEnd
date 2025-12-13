import Joi from "joi";

export const createAuthorSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  bio: Joi.string().max(500).optional(),
});

export const updateAuthorSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  bio: Joi.string().max(500).optional(),
});
