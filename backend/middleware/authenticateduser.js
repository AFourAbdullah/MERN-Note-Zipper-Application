const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authenticated = asynchandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await userModel.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(400);
      throw new Error("user unauthorized or token is missing");
    }
  }
  if (!token) {
    res.status(400);
    throw new Error("user unauthorized or token is missing");
  }
});

module.exports = authenticated;
