const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated() || req.session.user) {
      return next();
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  };
  
  module.exports = { ensureAuth };
  