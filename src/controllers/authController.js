import User from '../models/User.js';
import { signToken, cookieOptions } from '../utils/token.js';

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email or username already in use',
      });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken({ id: user._id, role: user.role });
    res.cookie('token', token, cookieOptions);

    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', { ...cookieOptions, maxAge: 0 });
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      lastLoginAt: req.user.lastLoginAt,
    },
  });
};

export default { register, login, logout, getMe };