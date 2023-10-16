const express = require('express');
const router = express.Router();

// HTML route for '/notes'
router.get('/notes', (req, res) => {
    res.sendFile('public/notes.html', { root: __dirname + '/../' });
});

module.exports = router;

    