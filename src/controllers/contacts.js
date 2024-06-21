import createHttpError from 'http-errors';

import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactsById,
  upsertContactById,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await getContactsById(contactId, req.user._id);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found!'));
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { body } = req;

  const newContact = await createContact(body, req.user._id);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const putContactByIdController = async (req, res, next) => {
  const contactId = req.params.contactId;
  const userId = req.user._id;
  const newContactBody = req.body;

  const result = await upsertContactById(contactId, newContactBody, userId, {
    upsert: true,
  });

  if (!result) {
    return next(createHttpError(404, 'Contact not found'));
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: result.isNew ? 'Contact created!' : 'Contact updated!',
    data: result.contact,
  });
};

export const patchContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const newContactBody = req.body;
  const photo = req.file;

  const result = await upsertContactById(
    contactId,
    newContactBody,
    req.user._id,
  );

  if (!result) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: `Successfully parsed contact!`,
    data: result.contact,
  });
};

export const deleteContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContactById(contactId, req.user._id);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(204).send();
};
