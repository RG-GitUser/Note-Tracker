//declaring our variables 

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; 

//middleware for JSON data 
app.use(express.json());

//static files 
app.use(express.static('public'));


//start the server ('PORT')
app.listen(PORT, () => {
    console.log('Serve is running on port ${PORT}');
});

