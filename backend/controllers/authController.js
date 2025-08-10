const axios = require('axios');
const querystring = require('querystring');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
const redirect_uri = `${BACKEND_URL}/auth/callback`;

exports.login = (req, res) => {
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
};

exports.callback = async (req, res) => {
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

    req.session.access_token = tokenResponse.data.access_token;
    req.session.refresh_token = tokenResponse.data.refresh_token;

    res.redirect(`${FRONTEND_URL}/home`);
  } catch (error) {
    console.error('Error fetching tokens:', error.response?.data || error.message);
    res.status(500).send('Failed to get tokens');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Failed to log out');
    }
    res.clearCookie('connect.sid');
    res.send({ success: true });
  });
};