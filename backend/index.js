require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const session = require('express-session');
const cors = require('cors');
const { error } = require('console');

const app = express();

const PORT = process.env.PORT || 3001;

// LocalTunnel URLs
const BACKEND_URL = 'http://127.0.0.1:3001'; // Backend local URL
const FRONTEND_URL = 'http://127.0.0.1:3000'; // Frontend local URL
const redirect_uri = `${BACKEND_URL}/auth/callback`;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// CORS config to allow React frontend (LocalTunnel)
app.use(cors({
  origin: 'http://127.0.0.1:3000',
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Not HTTPS in local dev
    httpOnly: true,
    sameSite: 'lax', // 'lax' is fine for local dev
  }
}));

// --- API and auth routes ---

// Redirect user to Spotify login/authorization page
app.get('/auth/login', (req, res) => {
  const scope = [
    'user-read-private',
    'user-read-email',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-top-read',
  ].join(' ');

  const params = querystring.stringify({
    response_type: 'code',
    client_id,
    scope,
    redirect_uri,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

// Handle Spotify callback and get tokens
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code || null;

  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
    });

    // Store tokens in session
    req.session.access_token = tokenResponse.data.access_token;
    req.session.refresh_token = tokenResponse.data.refresh_token;

    console.log('Access Token:', req.session.access_token);
    console.log('Refresh Token:', req.session.refresh_token);

    // Show a success page instead of redirecting
    res.redirect(`${FRONTEND_URL}/home`);

  } catch (error) {
    console.error('Error fetching tokens:', error.response?.data || error.message);
    res.status(500).send('Failed to get tokens');
  }
});

// API to check if user is logged in (session has access token)
app.get('/api/auth/status', (req, res) => {
  if (req.session.access_token) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// Logout route
app.post('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Failed to log out');
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.send({ success: true });
  });
});

app.get('/api/spotify/profile', async (req, res) => {
  const accessToken = req.session.access_token;
  if (!accessToken) {
    return res.status(401).json({error: "User not authenticated"});
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const {
      explicit_content,
      external_urls,
      followers,
      href,
      images,
      type,
      ...filteredProfile
    } = response.data;

    res.json(filteredProfile);
  } catch (error) {
    console.error('Error fetching Spotify profile:', error.response?.data || error.message);
    res.status(500).send('Failed to get Spotify profile');
  }
});

app.get('/api/top-artists', async (req, res) => {
  const accessToken = req.session.access_token;
  if (!accessToken) {
    return res.status(401).json({error: "User not authenticated"});
  }

  try {
    const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        limit: 25,
        time_range: 'long_term' // Adjust as needed
      },
    });

    res.json(topArtistsResponse.data.items);
  } catch (error) {
    console.error('Error fetching top artists:', error.response?.data || error.message);
    res.status(500).send('Failed to get top artists');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Backend tunnel URL: ${BACKEND_URL}`);
  console.log(`Frontend tunnel URL: ${FRONTEND_URL}`);
});