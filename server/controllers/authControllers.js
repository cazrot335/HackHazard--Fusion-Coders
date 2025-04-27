const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ fullName, email, password: hashedPassword });
    res.status(201).json({ user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    req.session.user = existingUser;
    res.status(200).json({ user: existingUser });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

const getUser = (req, res) => {
  if (req.user || req.session.user) {
    res.json({ user: req.user || req.session.user });
  } else {
    res.status(401).json({ user: null });
  }
};

const logout = (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
};

module.exports = { signup, login, getUser, logout };
