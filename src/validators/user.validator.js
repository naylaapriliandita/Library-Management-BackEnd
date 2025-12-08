import Joi from 'joi';

// Skema untuk mengupdate role pengguna
export const updateRoleSchema = Joi.object({
  role: Joi.string().valid('USER', 'ADMIN').required(),
});