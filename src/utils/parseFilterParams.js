// const parseContactType = (contactType) => {
//   const isString = typeof contactType === 'string';
//   if (!isString) return;

//   const isValidContactType = (contactType) =>
//     ['work', 'home', 'personal'].includes(contactType);
//   if (isValidContactType(contactType)) return contactType;
// };

// const parseIsFavourite = (isFavourite) => {
//   const isBoolean = typeof isFavourite === 'boolean';
//   if (!isBoolean) return;
// };

// export const parseFilterParams = (query) => {
//   const { isFavourite, contactType } = query;

//   const parsedIsFavourite = parseIsFavourite(isFavourite);
//   const parsedContactType = parseContactType(contactType);

//   return {
//     isFavourite: parsedIsFavourite,
//     contactType: parsedContactType,
//   };
// };

const parseContactType = (contactType) => {
  if (typeof contactType !== 'string') return undefined;

  const validContactTypes = ['work', 'home', 'personal'];
  if (validContactTypes.includes(contactType)) {
    return contactType;
  }

  return undefined;
};

const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite === 'boolean') {
    return isFavourite;
  }

  return undefined;
};

export const parseFilterParams = (query) => {
  const { isFavourite, contactType } = query;

  const parsedIsFavourite = parseIsFavourite(isFavourite);
  const parsedContactType = parseContactType(contactType);

  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedContactType,
  };
};
