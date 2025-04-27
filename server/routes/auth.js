const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    
    res.redirect(`${process.env.CLIENT_URL}/code-editor`);
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(`${process.env.CLIENT_URL}`);

  });
});

module.exports = router;
