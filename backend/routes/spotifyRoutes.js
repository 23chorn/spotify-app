const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');

router.get('/profile', spotifyController.getProfile);
router.get('/top-artists', spotifyController.getTopArtists);

module.exports = router;