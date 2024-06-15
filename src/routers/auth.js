import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import {
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
  loginUserController,
} from '../controllers/auth.js';

import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

// router.post('/logout', ctrlWrapper(logoutUserController));
// router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.post('/logout', authenticate, ctrlWrapper(logoutUserController));
router.post(
  '/refresh',
  authenticate,
  ctrlWrapper(refreshUserSessionController),
);

export default router;
