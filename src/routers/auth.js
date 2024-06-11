import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema } from '../validation/auth.js';
import {
  logoutUserController,
  refreshUserSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { loginUserSchema } from '../validation/auth.js';
import { loginUserController } from '../controllers/auth.js';
// import { authenticate } from '../middlewares/authenticate.js';

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

// router.post('/logout', authenticate, ctrlWrapper(logoutUserController));
router.post('/logout', ctrlWrapper(logoutUserController));

// router.post(
//   '/refresh',
//   authenticate,
//   ctrlWrapper(refreshUserSessionController),
// );
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;
