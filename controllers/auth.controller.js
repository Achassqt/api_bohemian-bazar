const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { loginErrors } = require("../utils/errors.utils");

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = ({ userId }) => {
  return jwt.sign({ userId }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

exports.signup = async (req, res) => {
  const { pseudo, password } = req.body;

  try {
    const user = await User.create({
      pseudo,
      password,
    });
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(200).json({ err });
  }
};

exports.login = async (req, res) => {
  const { pseudo, password } = req.body;

  try {
    const user = await User.login(pseudo, password);
    const token = createToken({ userId: user._id });
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = loginErrors(err);
    res.status(200).json({ errors });
  }
};

exports.logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json("Logout");
  // res.redirect("/");
};

exports.getUsers = async (req, res) => {
  const users = await User.findOne();
  res.status(200).json(users);
};
