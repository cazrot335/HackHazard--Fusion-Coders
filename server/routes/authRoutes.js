const express = require("express");
const passport = require("passport");
const { signup, login, getUser, logout } = require("../controllers/authControllers");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", getUser);
router.get("/logout", logout);

// Github OAuth Routes
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback", 
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL + "/code-editor");
  }
);

module.exports = router;
