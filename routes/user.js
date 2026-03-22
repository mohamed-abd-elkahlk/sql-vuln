const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: `Welcome to your profile, ${req.user.username}!`,
    profile: {
      username: req.user.username,
      role: req.user.role
    }
  });
});

module.exports = router;
