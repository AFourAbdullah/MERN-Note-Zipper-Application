const asynchandler = require("express-async-handler");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateJwt = require("../utils/generateJWT");

const registerUser = asynchandler(async (req, res, next) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password || !pic) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await userModel.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateJwt(user._id),
    });
  } else {
    res.status(400);
    throw new Error("error occured");
  }
});
const loginUser = asynchandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      name: user.name,
      email: user.email,
      id: user._id,
      pic: user.pic,
      token: generateJwt(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
const updateProfile = asynchandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  const { name, email, pic } = req.body;
  if (user) {
    if (req.body.password) {
      const { password } = req.body;
    }
    const updateduser = await userModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    );
    res
      .status(201)
      .json({
        id: updateduser._id,
        email: updateduser.email,
        name: updateduser.name,
        isAdmin: updateduser.isAdmin,
        pic: updateduser.pic,
        token: generateJwt(updateduser._id),
      });
  } else {
    res.status(401);
    throw new Error("user not found");
  }
});
module.exports = { registerUser, loginUser, updateProfile };
