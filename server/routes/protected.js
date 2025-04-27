const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/authMiddleware'); // Your auth check middleware

router.get('/code-editor', ensureAuthenticated, (req, res) => {
  res.json({ message: 'Access granted to Code Editor' });
});

module.exports = router;
