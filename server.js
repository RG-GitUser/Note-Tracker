// Variables declared
const express = require('express');
const app = express();
const api_route = require('./routes/api-route');
const html_route = require('./routes/html-route');
const PORT = process.env.PORT || 3000; 

// Middleware for static files from the 'public' directory 
app.use(express.static('public'));

// HTML and API endpoints defined 
app.use(html_route);
app.use(api_route);

// starting the server - listening for requests on the specifc port 
api_route.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});

