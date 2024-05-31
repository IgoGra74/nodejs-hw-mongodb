import { Router } from 'express';
import {
  createContactController,
  deleteContactByIdController,
  getContactByIdController,
  getContactsControler,
  patchContactByIdController,
  putContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper';

export const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsControler));

contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post('/contacts', ctrlWrapper(createContactController));

contactsRouter.put(
  '/contacts/:contactId',
  ctrlWrapper(putContactByIdController),
);
contactsRouter.patch(
  '/contacts/:contactId',
  ctrlWrapper(patchContactByIdController),
);
contactsRouter.delete(
  '/contacts/:contactId',
  ctrlWrapper(deleteContactByIdController),
);
