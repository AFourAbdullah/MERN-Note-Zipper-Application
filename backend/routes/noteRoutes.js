const express = require("express");
const {
  getAllNotes,
  createNote,
  getSingleNote,
  updateNote,
  deleteNote,
} = require("../controllers/noteControllers");
const authenticated = require("../middleware/authenticateduser");
const router = express.Router();
router.route("/").get(authenticated, getAllNotes);
router
  .route("/:id")
  .get(authenticated, getSingleNote)
  .put(authenticated, updateNote)
  .delete(authenticated, deleteNote);
router.route("/create").post(authenticated, createNote);

module.exports = router;
