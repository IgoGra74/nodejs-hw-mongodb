import { Router } from 'express';
import {
  createContactController,
  deleteContactByIdController,
  getContactByIdController,
  getContactsControler,
  patchContactByIdController,
  putContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

export const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsControler));

contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.put(
  '/contacts/:contactId',
  validateBody(createContactSchema),
  ctrlWrapper(putContactByIdController),
);
contactsRouter.patch(
  '/contacts/:contactId',
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactByIdController),
);
contactsRouter.delete(
  '/contacts/:contactId',
  ctrlWrapper(deleteContactByIdController),
);
