import mongoose from 'mongoose';
import {
  createContact,
  deleteContactsById,
  getAllContacts,
  getContactsById,
  upsertContactById,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsControler = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const contactId = req.params.contactId;

  if (!mongoose.isValidObjectId(contactId)) {
    return res.status(400).json({
      status: 400,
      message: `Invalid contact ID format: ${contactId}`,
    });
  }

  const contact = await getContactsById(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found!'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const newContact = req.body;

  const createdContact = await createContact(newContact);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: createdContact,
  });
};

export const putContactByIdController = async (req, res, next) => {
  const contactId = req.params.contactId;

  if (!mongoose.isValidObjectId(contactId)) {
    return res.status(400).json({
      status: 400,
      message: `Invalid contact ID format: ${contactId}`,
    });
  }

  const newContactBody = req.body;

  const result = await upsertContactById(contactId, newContactBody, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: result.isNew ? 'Contact created!' : 'Contact updated!',
    data: result.contact,
  });
};

export const patchContactByIdController = async (req, res, next) => {
  const contactId = req.params.contactId;

  if (!mongoose.isValidObjectId(contactId)) {
    return res.status(400).json({
      status: 400,
      message: `Invalid contact ID format:  ${contactId}`,
    });
  }

  const newContactBody = req.body;

  const contact = await upsertContactById(contactId, newContactBody);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully parsed contact!`,
    data: contact,
  });
};

export const deleteContactByIdController = async (req, res, next) => {
  const contactId = req.params.contactId;

  if (!mongoose.isValidObjectId(contactId)) {
    return res.status(400).json({
      status: 400,
      message: `Invalid contact ID format:  ${contactId}`,
    });
  }

  const contact = await deleteContactsById(contactId);
  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
