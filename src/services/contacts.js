import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactsById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (newContact) => {
  const contact = await ContactsCollection.create(newContact);
  return contact;
};

export const deleteContactsById = async (contactId) => {
  const contact = await ContactsCollection.findByIdAndDelete({
    _id: contactId,
  });
  return contact;
};

export const upsertContactById = async (
  contactId,
  newContact,
  options = {},
) => {
  const rawResult = await ContactsCollection.findByIdAndUpdate(
    contactId,
    newContact,
    { new: true, includeResultMetadata: true, ...options },
  );
  if (!rawResult || !rawResult.value) {
    throw createHttpError(404, 'Contact not found!');
  }

  return {
    student: rawResult.value,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};
