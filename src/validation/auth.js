import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  password: Joi.string().required(),
  email: Joi.string().required().email(),
});

export const loginUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required().email(),
});

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});
