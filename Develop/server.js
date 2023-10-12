// Here we are declaring our variables 

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; 

// The middleware for JSON data 
app.use(express.json());

// Here we have static files 
app.use(express.static('public'));

// This displays the API route for notes 
const notesRoutes = require('./routes/notesRoutes');
app.use('/api', notesRoutes);

// here we are using the notes.html file for notes route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
