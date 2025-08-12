const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');
const { checkSpotifyAuth } = require('../middleware/authMiddleware');

router.get('/profile', checkSpotifyAuth, spotifyController.getProfile);
router.get('/top-tracks', checkSpotifyAuth, spotifyController.getTopTracks);
router.get('/top-artists', checkSpotifyAuth, spotifyController.getTopArtists);
router.get('/recently-played', checkSpotifyAuth, spotifyController.getRecentlyPlayed);
router.get('/playlists', checkSpotifyAuth, spotifyController.getUserPlaylists);

module.exports = router;