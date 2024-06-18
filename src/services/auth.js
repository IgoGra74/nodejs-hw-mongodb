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

const createSession = async () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + TWO_DAY),
  };
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

  // const accessToken = randomBytes(30).toString('base64');
  // const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    ...createSession(),
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({
    _id: sessionId,
  });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  // console.log({ session });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  // const user = await UsersCollection.findById(session.userId);
  // if (!user) {
  //   throw createHttpError(401, 'Session not found!');
  // }
  const newSession = createSession();

  await SessionsCollection.deleteOne({
    _id: sessionId,
  });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
