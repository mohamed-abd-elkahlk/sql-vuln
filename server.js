const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Root route redirects to login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
