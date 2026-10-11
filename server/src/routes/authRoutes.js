import express from 'express';
import bcrypt from 'bcryptjs';
import { store } from '../data/dbStore.js';
import { generateToken, protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const existing = await store.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await store.createUser({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, avatar, password } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await store.findByIdAndUpdate
      ? await store.findByIdAndUpdate(req.user._id, updates)
      : req.user;

    res.json({
      _id: req.user._id,
      name: updates.name || req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: updates.avatar || req.user.avatar,
      token: generateToken(req.user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Get all users (Admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await store.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

export default router;
