const express = require("express");
const router = express.Router();
const Notes = require("../model/Notes");
var fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

// Route1: Fetch notes using: GET "/api/notes/getuser".
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// Route2: Add new notes using: POST "/api/notes/addnote login required".
router.post(
  "/addnotes",
  fetchUser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route3: Update notes using: PUT "/api/notes/updatenote login required".
router.put(
        "/updatenotes/:id",
        fetchUser,
        async (req, res) => {
          try {
            const { title, description, tag } = req.body;
            //create new note object
            const newNote = {};
            if(title){newNote.title = title}
            if(description){newNote.description = description}
            if(tag){newNote.tag = tag}

            //Find the note to be updated and update it
        let note = await Notes.findById(req.params.id)
        if (!note) {
               return res.status(404).send("Not Found");
        }
        if (note?.user?.toString() !== req.user.id) {
               return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id,{$set: newNote}, {new:true})

        res.json({note});

          } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
          }
        }
      );
// Route4: Delete notes using: DELETE "/api/notes/updatenote login required".
router.delete(
        "/deletenotes/:id",
        fetchUser,
        async (req, res) => {
          try {
        //     const { title, description, tag } = req.body;

            //Find the note to be updated and update it
        let note = await Notes.findById(req.params.id)
        if (!note) {
               return res.status(404).send("Not Found");
        }
        if (note?.user?.toString() !== req.user.id) {
               return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id)

        res.json({"Success":"Note Deleted", note:note});

          } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error");
          }
        }
      );
module.exports = router;
