import createHttpError from 'http-errors';
import mongoose from 'mongoose';

import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactsById,
  patchContactById,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

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

  if (!mongoose.isValidObjectId(contactId)) {
    return res.status(400).json({
      status: 400,
      message: 'Id is invalid',
    });
  }

  const contact = await getContactsById(req.user._id, contactId);

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
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const newContact = await createContact({
    ...body,
    userId: req.user._id,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const patchContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await patchContactById(req.user._id, contactId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: `Successfully  patched a contact!`,
    data: contact,
  });
};

export const deleteContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContactById(req.user._id, contactId);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(204).send();
};
