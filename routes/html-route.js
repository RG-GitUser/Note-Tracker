const router = require('express').Router();
const path = require('path'); 


// route for HTML file 
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
});


// route for notes file
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});

module.exports = router;

