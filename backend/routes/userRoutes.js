const express = require("express");
const {
  registerUser,
  loginUser,
  updateProfile,
} = require("../controllers/userControllers");
const authenticated = require("../middleware/authenticateduser");
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", authenticated, updateProfile);

module.exports = router;
