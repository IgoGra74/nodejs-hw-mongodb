import {
  logoutUser,
  refreshUsersSession,
  registerUser,
  loginUser,
} from '../services/auth.js';

import { TWO_DAY } from '../constants/index.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: new Date(Date.now() + TWO_DAY),
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: new Date(Date.now() + TWO_DAY),
  });

  // setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  // if (req.cookies.sessionId) {
  //   await logoutUser(req.cookies.sessionId);
  // }
  await logoutUser({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).json({ status: 204, message: 'Successfully logged out' });
};

const setupSession = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: new Date(Date.now() + TWO_DAY),
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: new Date(Date.now() + TWO_DAY),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshUsersSession({
    sessionId,
    refreshToken,
  });

  setupSession(res, session);

  // console.log(session);
  res.json({
    status: 200,
    message: 'Successfully refreshed session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
