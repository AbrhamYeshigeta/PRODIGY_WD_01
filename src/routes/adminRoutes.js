import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

// Admin-only: list all users
router.get('/users', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-__v');
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
});

export default router;