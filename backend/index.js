require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');

const authRoutes = require('./routes/authRoutes');
const spotifyRoutes = require('./routes/spotifyRoutes');

const app = express();

const PORT = process.env.PORT || 3001;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // HTTPS false for local dev
    httpOnly: true,
    sameSite: 'lax',
  }
}));

app.use('/auth', authRoutes);
app.use('/api/spotify', spotifyRoutes);

// Auth status endpoint
app.get('/api/auth/status', (req, res) => {
  res.json({ loggedIn: !!req.session.access_token });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});