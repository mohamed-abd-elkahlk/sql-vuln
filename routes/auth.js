const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

// VULNERABLE LOGIN
router.post('/login-vulnerable', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findVulnerable(username, password);
    if (user) {
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ message: 'Login successful', role: user.role, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// SECURE LOGIN
router.post('/login-secure', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findSecure(username, password);
    if (user) {
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ message: 'Login successful', role: user.role, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// REGISTER ROUTE (VULNERABLE)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // VULNERABLE: Direct concatenation in the creation logic
    const result = await User.createVulnerable(username, password);
    
    // If the exploit commented out 'RETURNING *', the result might be undefined 
    // but the user might still have been created.
    if (result) {
      return res.status(201).json({ 
        message: 'User created successfully', 
        user: { id: result.id, username: result.username, role: result.role } 
      });
    }

    // Fallback: If no data returned, we assume it worked if no error was thrown
    // in this specific vulnerable lab context.
    res.status(201).json({ 
      message: 'User created successfully (Note: Injection may have commented out result data)',
      user: { username: username.split("'")[0], role: 'Check dashboard' }
    });

  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
});

module.exports = router;
