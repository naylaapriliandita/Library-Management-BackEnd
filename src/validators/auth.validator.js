import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Skema baru untuk validasi Refresh Token
export const refreshSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        "any.required": "Refresh Token wajib diisi",
        "string.base": "Refresh Token harus berupa teks",
    }),
});