const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Middleware to protect routes
const auth = require('../middleware/auth');

// In-memory storage for users when MongoDB is not available
let inMemoryUsers = [];

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password, phone, role, location, preferredLanguage, accessibilityNeeds, specialization, bio, consultationFee } = req.body;

    // Check if MongoDB is available
    const isMongoAvailable = require('mongoose').connection.readyState === 1;
    
    if (isMongoAvailable) {
      // Use MongoDB
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Create new user with base fields
      const userData = {
        name,
        email,
        password,
        phone,
        role: role || 'patient',
        location,
        preferredLanguage,
        accessibilityNeeds,
      };

      // Add doctor-specific fields if role is doctor
      if (role === 'doctor') {
        userData.specialization = specialization;
        userData.bio = bio;
        userData.consultationFee = consultationFee;
      }

      user = new User(userData);
      await user.save();
      
      // Create JWT token
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        }
      );
    } else {
      // Use in-memory storage when MongoDB is not available
      
      // Check if user already exists in memory
      const existingUser = inMemoryUsers.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user object
      const newUser = {
        id: Date.now().toString(), // Simple ID generation
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || 'patient',
        location,
        preferredLanguage,
        accessibilityNeeds,
      };

      // Add doctor-specific fields if role is doctor
      if (role === 'doctor') {
        newUser.specialization = specialization;
        newUser.bio = bio;
        newUser.consultationFee = consultationFee;
      }

      // Store user in memory
      inMemoryUsers.push(newUser);

      // Create JWT token
      const payload = {
        user: {
          id: newUser.id,
          role: newUser.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token, 
            user: { 
              id: newUser.id, 
              name: newUser.name, 
              email: newUser.email, 
              role: newUser.role 
            } 
          });
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if MongoDB is available
    const isMongoAvailable = require('mongoose').connection.readyState === 1;
    
    if (isMongoAvailable) {
      // Use MongoDB
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Create JWT token
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        }
      );
    } else {
      // Use in-memory storage when MongoDB is not available
      
      // Find user in memory
      const user = inMemoryUsers.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Create JWT token
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({ 
            token, 
            user: { 
              id: user.id, 
              name: user.name, 
              email: user.email, 
              role: user.role 
            } 
          });
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;