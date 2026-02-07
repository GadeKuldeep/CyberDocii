const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  let { username, email, password } = req.body;

  try {
    if (email) email = email.toLowerCase().trim();
    if (username) username = username.trim();
    if (!username || !email || !password) {
      res.status(400);
      throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      res.status(400);
      const field = userExists.email === email ? 'Email' : 'Username';
      throw new Error(`${field} already exists`);
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    // If the error status was already set (e.g. 400), keep it. Otherwise default to 500 (done by errorHandler usually, but manual setting here helps)
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 400;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  let { email, password } = req.body;

  try {
    console.log('--- Login Attempt ---');
    console.log('Raw Email:', email);

    if (email) email = email.toLowerCase().trim();
    console.log('Normalized Email:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User NOT found in DB');
      res.status(401);
      throw new Error('Invalid email or password');
    }

    console.log('User found:', user.username);
    const isMatch = await user.matchPassword(password);
    console.log('Password Match Result:', isMatch);

    if (isMatch) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log('Password mismatch');
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(401).json({ message: error.message });
  }
};

// @desc    Get all users (for discovery)
// @route   GET /api/auth/users
// @access  Public
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').select('-email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getAllUsers };
