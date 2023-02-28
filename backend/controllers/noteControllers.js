const asynchandler = require("express-async-handler");
const noteModel = require("../models/noteModels");
const getAllNotes = asynchandler(async (req, res) => {
  const notes = await noteModel.find({ user: req.user._id });
  res.status(200).json(notes);
});

const getSingleNote = asynchandler(async (req, res) => {
  const note = await noteModel.findById(req.params.id);
  if (note) {
    res.status(200).json(note);
  } else {
    res.status(400);
    throw new Error("Note not found!");
  }
});

const createNote = asynchandler(async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const newNote = await noteModel.create({
    title,
    content,
    category,
    user: req.user._id,
  });
  res.status(201).json(newNote);
});
const updateNote = asynchandler(async (req, res) => {
  const { title, content, category } = req.body;
  const noteExist = await noteModel.findById(req.params.id);
  if (!noteExist) {
    res.status(400);
    throw new Error("Note not found");
  }
  if (noteExist.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access not allowed!");
  }
  const updatedNote = await noteModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(201).json(updatedNote);
});
const deleteNote = asynchandler(async (req, res) => {
  const noteExist = await noteModel.findById(req.params.id);
  if (!noteExist) {
    res.status(400);
    throw new Error("Note not found");
  }
  if (noteExist.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access not allowed!");
  }
  await noteExist.remove();
  res.status(200).json({ success: true });
});

module.exports = {
  getAllNotes,
  createNote,
  getSingleNote,
  updateNote,
  deleteNote,
};
