import Joi from "joi";

export const createBookSchema = Joi.object({
    title: Joi.string().min(1).required(),
    authorId: Joi.number().integer().required(),
    stock: Joi.number().integer().min(0).required(),
});

export const updateBookSchema = Joi.object({
    title: Joi.string().min(1),
    authorId: Joi.number().integer(),
    stock: Joi.number().integer().min(0),
});