const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.get('/dashboard', verifyToken, authorizeRole('admin'), (req, res) => {
  res.json({
    message: 'Welcome to the Admin Dashboard!',
    adminInfo: {
      secretData: 'Highly confidential admin information.',
      systemStatus: 'Optimal'
    }
  });
});

module.exports = router;
