import Joi from "joi";

export const createUserSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("USER", "ADMIN").required()
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().email(),
    password: Joi.string().min(8),
    role: Joi.string().valid("USER", "ADMIN")
});