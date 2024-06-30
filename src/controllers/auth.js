import {
  logoutUser,
  refreshUsersSession,
  registerUser,
  loginUser,
  resetToken,
  // loginOrSignupWithGoogle,
} from '../services/auth.js';

import { TWO_DAY } from '../constants/index.js';
import { resetPassword } from '../services/auth.js';
// import { generateAuthUrl } from '../utils/googleOAuth2.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
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

  res.json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
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

  res.json({
    status: 200,
    message: 'Successfully refreshed session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const resetTokenController = async (req, res) => {
  await resetToken(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};

// export const getGoogleOAuthUrlController = async (req, res) => {
//   const url = generateAuthUrl();
//   res.json({
//     status: 200,
//     message: 'Successfully get Google OAuth url!',
//     data: {
//       url,
//     },
//   });
// };

// export const loginWithGoogleController = async (req, res) => {
//   const session = await loginOrSignupWithGoogle(req.body.code);
//   setupSession(res, session);

//   res.json({
//     status: 200,
//     message: 'Successfully logged in via Google OAuth!',
//     data: {
//       accessToken: session.accessToken,
//     },
//   });
// };
