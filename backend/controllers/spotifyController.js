const axios = require('axios');

exports.getProfile = async (req, res) => {
  const accessToken = req.session.access_token;
  if (!accessToken) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
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
};

exports.getTopArtists = async (req, res) => {
  const accessToken = req.session.access_token;
  if (!accessToken) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { limit: 25, time_range: 'long_term' },
    });

    res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching top artists:', error.response?.data || error.message);
    res.status(500).send('Failed to get top artists');
  }
};