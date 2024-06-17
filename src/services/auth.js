import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import { FIFTEEN_MINUTES, TWO_DAY } from '../constants/index.js';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'User with this email already exists');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Wrong email or password');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  return await createSession(user._id);
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({
    _id: sessionId,
  });
};

const createSession = async (userId) => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + TWO_DAY),
  });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });
  const newSession = await createSession(session.userId);

  return newSession;
  // return await createSession(session.userId);
};

// import bcrypt from 'bcrypt';
// import createHttpError from 'http-errors';
// import { randomBytes } from 'crypto';

// import { FIFTEEN_MINUTES, TWO_DAY } from '../constants/index.js';
// import { UsersCollection } from '../db/models/user.js';
// import { SessionsCollection } from '../db/models/session.js';

// export const registerUser = async (payload) => {
//   const user = await UsersCollection.findOne({ email: payload.email });

//   if (user) {
//     throw createHttpError(409, 'User with this email already exists');
//   }

//   const encryptedPassword = await bcrypt.hash(payload.password, 10);

//   return await UsersCollection.create({
//     ...payload,
//     password: encryptedPassword,
//   });
// };

// export const loginUser = async (payload) => {
//   const user = await UsersCollection.findOne({ email: payload.email });

//   if (!user) {
//     throw createHttpError(404, 'User not found');
//   }

//   const isEqual = await bcrypt.compare(payload.password, user.password);

//   if (!isEqual) {
//     throw createHttpError(401, 'Wrong email or password');
//   }

//   await SessionsCollection.deleteOne({ userId: user._id });

//   const accessToken = randomBytes(30).toString('base64');
//   const refreshToken = randomBytes(30).toString('base64');

//   return await SessionsCollection.create({
//     userId: user._id,
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
//     refreshTokenValidUntil: new Date(Date.now() + TWO_DAY),
//   });
// };

// export const logoutUser = async (sessionId) => {
//   await SessionsCollection.deleteOne({
//     _id: sessionId,
//   });
// };

// const createSession = async () => {
//   const accessToken = randomBytes(30).toString('base64');
//   const refreshToken = randomBytes(30).toString('base64');

//   return {
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
//     refreshTokenValidUntil: new Date(Date.now() + TWO_DAY),
//   };
// };

// export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
//   const session = await SessionsCollection.findOne({
//     _id: sessionId,
//     refreshToken,
//   });
//   // console.log({ session });

//   if (!session) {
//     throw createHttpError(401, 'Session not found');
//   }

//   const isSessionTokenExpired =
//     new Date() > new Date(session.refreshTokenValidUntil);

//   if (isSessionTokenExpired) {
//     throw createHttpError(401, 'Session token expired');
//   }

//   // const user = await UsersCollection.findById(session.userId);
//   // if (!user) {
//   //   throw createHttpError(401, 'Session not found!');
//   // }

//   await SessionsCollection.deleteOne({
//     _id: sessionId,
//     refreshToken,
//   });

//   const newSession = createSession();

//   return await SessionsCollection.create({
//     userId: session.userId,
//     ...newSession,
//   });
// };

// import bcrypt from 'bcrypt';
// import createHttpError from 'http-errors';
// import { randomBytes } from 'crypto';
// import jwt from 'jsonwebtoken';

// import { FIFTEEN_MINUTES, TWO_DAY } from '../constants/index.js';
// import { UsersCollection } from '../db/models/user.js';
// import { SessionsCollection } from '../db/models/session.js';

// export const registerUser = async (payload) => {
//   const user = await UsersCollection.findOne({ email: payload.email });

//   if (user) {
//     throw createHttpError(409, 'User with this email already exists');
//   }

//   const encryptedPassword = await bcrypt.hash(payload.password, 10);

//   return await UsersCollection.create({
//     ...payload,
//     password: encryptedPassword,
//   });
// };

// export const loginUser = async (payload) => {
//   const user = await UsersCollection.findOne({ email: payload.email });

//   if (!user) {
//     throw createHttpError(404, 'User not found');
//   }

//   const isEqual = await bcrypt.compare(payload.password, user.password);

//   if (!isEqual) {
//     throw createHttpError(401, 'Wrong email or password');
//   }

//   await SessionsCollection.deleteOne({ userId: user._id });

//   const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//     expiresIn: '15m',
//   });
//   const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });

//   return await SessionsCollection.create({
//     userId: user._id,
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
//     refreshTokenValidUntil: new Date(Date.now() + TWO_DAY),
//   });
// };

// export const logoutUser = async (sessionId) => {
//   await SessionsCollection.deleteOne({
//     _id: sessionId,
//   });
// };

// export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
//   const session = await SessionsCollection.findOne({
//     _id: sessionId,
//     refreshToken,
//   });

//   if (!session) {
//     throw createHttpError(401, 'Session not found');
//   }

//   const isSessionTokenExpired =
//     new Date() > new Date(session.refreshTokenValidUntil);

//   if (isSessionTokenExpired) {
//     throw createHttpError(401, 'Session token expired');
//   }

//   await SessionsCollection.deleteOne({
//     _id: sessionId,
//     refreshToken,
//   });

//   const accessToken = jwt.sign(
//     { userId: session.userId },
//     process.env.JWT_SECRET,
//     { expiresIn: '15m' },
//   );
//   const newRefreshToken = jwt.sign(
//     { userId: session.userId },
//     process.env.JWT_SECRET,
//     { expiresIn: '30d' },
//   );

//   return await SessionsCollection.create({
//     userId: session.userId,
//     accessToken,
//     refreshToken: newRefreshToken,
//     accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
//     refreshTokenValidUntil: new Date(Date.now() + TWO_DAY),
//   });
// };
