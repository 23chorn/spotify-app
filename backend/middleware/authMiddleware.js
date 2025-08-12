/**
 * Middleware to check if user is authenticated with Spotify
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const checkSpotifyAuth = (req, res, next) => {
  const accessToken = req.session.access_token;
  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  req.accessToken = accessToken; // Pass token to next middleware/route handler
  next();
};

module.exports = { checkSpotifyAuth };