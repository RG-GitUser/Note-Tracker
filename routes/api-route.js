//variables
const express = require('express');
const fs = require ('fs');
const router = express.Router();

//API route for getting notes 
router.get('/api/notes', (req, res) => {
    const notesData = fs.readFileSync('db/db.json', 'utf8'); //reading notes from JSON 

    const notes = JSON.parse(notesData); //parsing data from JSON
    res.json(notes); //sending JSON notes as a response 
});


//Creates a new note bases on request from body 
router.post('api/notes', (req, res) => {

const newNote = {
    id: notes.length + 1, 
    title: req.body.title,
    text: req.body.text, 
};

//Add note to notes array 
notes.push(newNote);

fs.writeFileSync('db/db.json', JSON.stringify(notes)); 

res.json(newNote);
});

module.exports = router; 