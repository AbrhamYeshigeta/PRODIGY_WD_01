import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const passwordRule = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
  .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
  .matches(/\d/).withMessage('Password must contain a number');

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    passwordRule,
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);

export default router;
