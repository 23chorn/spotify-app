const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');
const { checkSpotifyAuth } = require('../middleware/authMiddleware');

// Search endpoints
router.get('/search', checkSpotifyAuth, catalogController.search);

// Recommendations endpoint
router.get('/recommendations', checkSpotifyAuth, catalogController.getRecommendations);

// Artist endpoints
router.get('/artist/:id', checkSpotifyAuth, catalogController.getArtist);
router.get('/artist/:id/top-tracks', checkSpotifyAuth, catalogController.getArtistTopTracks);
router.get('/artist/:id/related', checkSpotifyAuth, catalogController.getRelatedArtists);

// Audio analysis endpoint
router.get('/audio-analysis/:id', checkSpotifyAuth, catalogController.getAudioAnalysis);

module.exports = router;