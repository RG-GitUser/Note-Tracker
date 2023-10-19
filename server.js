// Variables declared
const express = require('express');
const api_route = require('./routes/api-route');
const html_route = require('./routes/html-route');
const PORT = process.env.PORT || 5500;
const app = express();

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
app.get('/notes', (req, res) => {
  res.sendFile(`${__dirname}/public/notes.html`);
});

// starting the server - listening for requests on the specific port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
