const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// path to JSON file
const dataPath = path.join(__dirname, '../db/db.json');

// API route to get notes
router.get('/routes/api-route', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Unable to read data from the file' });
        } else {
            const notes = JSON.parse(data);
            res.json(notes);
        }
    });
});

module.exports = router;