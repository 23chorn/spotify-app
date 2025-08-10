module.exports = (req, res, next) => {
  if (!req.session.access_token) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  next();
};