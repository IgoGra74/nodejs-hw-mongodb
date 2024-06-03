import Joi from 'joi';
export const createContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be less than 20 characters long',
    'any.required': 'Name is required',
  }),
});
