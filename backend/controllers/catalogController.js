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
    headers: {
      'Authorization': `Bearer ${access_token}`
    },
    params
  });
}

exports.search = async (req, res) => {
  try {
    const { q, type = 'track,artist,album', limit = 20 } = req.query;
    const response = await getSpotifyData(
      req.accessToken,
      `${SPOTIFY_API_URL}/search`,
      { q, type, limit }
    );
    return res.json(response.data);
  } catch (error) {
    console.error('Search error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to search Spotify' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const response = await getSpotifyData(
      req.accessToken,
      `${SPOTIFY_API_URL}/recommendations`,
      req.query
    );
    return res.json(response.data);
  } catch (error) {
    console.error('Recommendations error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

exports.getArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getSpotifyData(
      req.accessToken,
      `${SPOTIFY_API_URL}/artists/${id}`
    );
    return res.json(response.data);
  } catch (error) {
    console.error('Artist fetch error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to get artist details' });
  }
};

exports.getArtistTopTracks = async (req, res) => {
  try {
    const { id } = req.params;
    const { market = 'US' } = req.query;
    const response = await getSpotifyData(
      req.accessToken,
      `${SPOTIFY_API_URL}/artists/${id}/top-tracks`,
      { market }
    );
    return res.json(response.data);
  } catch (error) {
    console.error('Artist top tracks error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to get artist top tracks' });
  }
};

exports.getRelatedArtists = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getSpotifyData(
      req.accessToken,
      `${SPOTIFY_API_URL}/artists/${id}/related-artists`
    );
    return res.json(response.data);
  } catch (error) {
    console.error('Related artists error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to get related artists' });
  }
};

exports.getAudioAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getSpotifyData(
      req.accessToken,
      `${SPOTIFY_API_URL}/audio-analysis/${id}`
    );
    return res.json(response.data);
  } catch (error) {
    console.error('Audio analysis error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to get audio analysis' });
  }
};