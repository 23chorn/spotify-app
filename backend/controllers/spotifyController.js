const axios = require('axios');

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

/**
 * Helper function to make authenticated requests to Spotify API
 * @param {string} access_token - Spotify access token
 * @param {string} url - API endpoint URL
 * @param {Object} params - Query parameters
 * @returns {Promise} Axios response
 */
async function getSpotifyData(access_token, url, params = {}) {
  return axios.get(url, {
    headers: { Authorization: `Bearer ${access_token}` },
    params,
  });
}

/**
 * Get user's Spotify profile
 * Filters out unnecessary profile data
 * Endpoint: GET /me
 * @returns {Object} Filtered user profile data
 */
exports.getProfile = async (req, res) => {
  try {
    const response = await getSpotifyData(req.accessToken, `${SPOTIFY_API_URL}/me`);

    const {
      explicit_content,
      external_urls,
      followers,
      href,
      images,
      type,
      ...filteredProfile
    } = response.data;

    return res.json(filteredProfile);
  } catch (error) {
    console.error('Error fetching Spotify profile:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to get Spotify profile' });
  }
};

/**
 * Get user's top tracks
 * Supports pagination and time range filtering
 * Endpoint: GET /me/top/tracks
 * @param {number} limit - Number of tracks (default: 20)
 * @param {string} time_range - Time range for analysis (short_term/medium_term/long_term)
 * @returns {Promise<Array>} List of track objects
 */
exports.getTopTracks = async (req, res) => {
  try {
    const response = await getSpotifyData(req.accessToken, `${SPOTIFY_API_URL}/me/top/tracks`, {
      limit: req.query.limit || 20,
      time_range: req.query.time_range || 'medium_term',
    });
    return res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching top tracks:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: "token_expired" });
    }
    return res.status(500).json({ error: 'Failed to get top tracks' });
  }
};

/**
 * Get user's top artists
 * Returns long-term top 25 artists
 * Endpoint: GET /me/top/artists
 * @returns {Promise<Array>} List of artist objects
 */
exports.getTopArtists = async (req, res) => {
  try {
    const response = await getSpotifyData(req.accessToken, `${SPOTIFY_API_URL}/me/top/artists`, {
      limit: req.query.limit || 25,
      time_range: req.query.time_range || 'long_term',
    });
    return res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching top artists:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to get top artists' });
  }
};

/**
 * Get user's recently played tracks
 * Endpoint: GET /me/player/recently-played
 * @param {number} limit - Number of tracks (default: 50)
 * @returns {Promise<Array>} List of play history objects with track and timestamp
 */
exports.getRecentlyPlayed = async (req, res) => {
  try {
    const params = {
      limit: req.query.limit || 50
    };

    // Add before/after parameters if provided
    if (req.query.before) {
      params.before = new Date(req.query.before).getTime();
    }
    if (req.query.after) {
      params.after = new Date(req.query.after).getTime();
    }

    const response = await getSpotifyData(
      req.accessToken,
      `${SPOTIFY_API_URL}/me/player/recently-played`,
      params
    );
    return res.json(response.data.items);
  } catch (error) {
    console.error('Error fetching recently played:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to get recently played tracks' });
  }
};

/**
 * Get user's playlists with pagination
 * Endpoint: GET /me/playlists
 * @param {number} limit - Number of playlists per page (default: 20)
 * @param {number} offset - Page offset
 * @returns {Object} Paginated playlist data
 */
exports.getUserPlaylists = async (req, res) => {
  try {
    const response = await getSpotifyData(req.accessToken, `${SPOTIFY_API_URL}/me/playlists`, {
      limit: req.query.limit || 20,
      offset: req.query.offset || 0,
    });
    return res.json(response.data); // includes items, total, limit, offset
  } catch (err) {
    console.error('Error fetching playlists:', err.response?.data || err.message);
    if (err.response?.status === 401) return res.status(401).json({ error: 'token_expired' });
    return res.status(500).json({ error: 'Failed to get playlists' });
  }
};

/**
 * Get audio features for multiple tracks
 * Endpoint: GET /audio-features
 * @param {string} ids - Comma-separated track IDs
 * @returns {Array} List of audio feature objects
 */
exports.getAudioFeatures = async (req, res) => {
  const accessToken = req.session.access_token;
  const ids = req.query.ids; // expected: "id1,id2,id3"
  if (!accessToken) return res.status(401).json({ error: 'Not authenticated' });
  if (!ids) return res.status(400).json({ error: 'Missing ids query param' });

  try {
    const response = await spotifyGet(accessToken, `${SPOTIFY_API}/audio-features`, {
      ids,
    });
    return res.json(response.data.audio_features); // array of features
  } catch (err) {
    console.error('Error fetching audio features:', err.response?.data || err.message);
    if (err.response?.status === 401) return res.status(401).json({ error: 'token_expired' });
    return res.status(500).json({ error: 'Failed to get audio features' });
  }
};