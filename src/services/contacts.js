// import createHttpError from 'http-errors';
// import { ContactsCollection } from '../db/models/contact.js';
// import { calculatePaginationData } from '../utils/calculatePaginationData.js';

// export const getAllContacts = async ({
//   page = 1,
//   perPage = 10,
//   sortBy = '_id',
//   sortOrder = 'SORT_ORDER.ASC',
//   filter = {},
// }) => {
//   const limit = perPage;
//   const skip = (page - 1) * perPage;
//   const contactsQuery = ContactsCollection.find();

//   if (filter.contactType) {
//     contactsQuery.where('contactType').equals(filter.contactType);
//   }
//   if (filter.isFavourite) {
//     contactsQuery.where('isFavourite').equals(filter.isFavourite);
//   }

//   const [contactsCount, contacts] = await Promise.all([
//     ContactsCollection.find().merge(contactsQuery).countDocuments(),
//     contactsQuery
//       .skip(skip)
//       .limit(limit)
//       .sort({ [sortBy]: sortOrder })
//       .exec(),
//   ]);

//   const paginationData = calculatePaginationData(contactsCount, perPage, page);

//   return {
//     data: contacts,
//     ...paginationData,
//   };
// };

// export const getContactsById = async (contactId) => {
//   const contact = await ContactsCollection.findById(contactId);
//   return contact;
// };

// export const createContact = async (newContact) => {
//   const contact = await ContactsCollection.create(newContact);
//   return contact;
// };

// export const deleteContactById = async (contactId) => {
//   const contact = await ContactsCollection.findByIdAndDelete({
//     _id: contactId,
//   });
//   return contact;
// };

// export const upsertContactById = async (
//   contactId,
//   newContact,
//   options = {},
// ) => {
//   const rawResult = await ContactsCollection.findByIdAndUpdate(
//     contactId,
//     newContact,
//     { new: true, includeResultMetadata: true, ...options },
//   );
//   if (!rawResult || !rawResult.value) {
//     throw createHttpError(404, 'Contact not found!');
//   }

//   return {
//     student: rawResult.value,
//     isNew: !rawResult?.lastErrorObject?.updatedExisting,
//   };
// };

import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'SORT_ORDER.ASC',
  filter = {},
  userId, // Добавлено поле userId
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsCollection.find({ userId }); // Добавлено условие userId

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactsById = async (contactId, userId) => {
  // Добавлено поле userId
  const contact = await ContactsCollection.findOne({ _id: contactId, userId }); // Добавлено условие userId
  return contact;
};

export const createContact = async (newContact) => {
  const contact = await ContactsCollection.create(newContact);
  return contact;
};

export const deleteContactById = async (contactId, userId) => {
  // Добавлено поле userId
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  }); // Добавлено условие userId
  return contact;
};

export const upsertContactById = async (
  contactId,
  newContact,
  userId, // Добавлено поле userId
  options = {},
) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId }, // Добавлено условие userId
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
