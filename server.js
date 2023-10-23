// Variables declared
const fs = require('fs');
const path = require('path');

const express = require('express');
const api_route = require('./routes/api-route');
const html_route = require('./routes/html-route');

const PORT = process.env.PORT || 3001;
const app = express();

// path to db.json file 
const dbFilePath = path.join(__dirname, 'db.json');

// Loads notes from db.json file
const loadNotes = () => {
  try {
    const data = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};


// Save notes to the db.json file
const saveNotes = (notes) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));
};


// getting files from "public" directory 
app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware for static files from the 'public' directory
app.use(express.static('public'));

// HTML and API endpoints defined
app.use('/api', api_route);
app.use('/', html_route);

// route to "notes.html" file
app.get('/notes.html', (req, res) => {
  res.sendFile(`${__dirname}/public/notes.html`);
});

// starting the server - listening for requests on the specific port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

