require('dotenv').config()
const express = require('express')
const router = express.Router();
const verifyToken = require('../middleware/auth.js');


const Note = require('../models/Note.js');
const User = require('../models/User.js');


router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId });
    const foundUser = await User.findOne({ _id: req.userId });
    const username = foundUser.username;
    res.json({ success: true, notes, username });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" })
  }
})


router.post('/', verifyToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title) return res.status(400).json({ success: false, message: "Title is require" });

  try {
    const newNote = new Note({
      title,
      content,
      user: req.userId
    })

    await newNote.save();
    res.json({ success: true, message: "Note is saved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" })
  }
})


router.put("/:noteId", verifyToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title) return res.status(400).json({ success: false, message: "Title is require" });

  try {
    let updatedNote = {
      title,
      content: content || "",
      user: req.userId
    }

    const postUpdatedCondition = { _id: req.params.noteId, user: req.userId }
    updatedNote = await Note.findOneAndUpdate(postUpdatedCondition, updatedNote, { new: true });

    if (!updatedNote) return res.status(401).json({ success: false, message: "Note not found or user not authorized" });

    res.json({ success: true, message: "Note updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" })
  }
})


router.delete("/:noteId", verifyToken, async (req, res) => {

  try {
    const postDeletedCondition = { _id: req.params.noteId, user: req.userId }
    const deletedNote = await Note.findOneAndDelete(postDeletedCondition);

    if (!deletedNote) return res.status(401).json({ success: false, message: "Note not found or user not authorized" });

    res.json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" })
  }

})


module.exports = router;