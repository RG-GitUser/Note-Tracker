// Variables declared
const express = require('express');
const path = require('path');
const app = express();
const api_route = require('./routes/api-route');
const html_route = require('./routes/html-route');
const PORT = process.env.PORT || 5500; 

// Middleware for static files from the 'public' directory 
app.use(express.static('public'));

// HTML and API endpoints defined 
app.use('/api', api_route);
app.use('/', html_route);

// route to "notes.html" file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// starting the server - listening for requests on the specifc port 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

