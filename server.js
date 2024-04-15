const express = require('express');
const axios = require('axios');
const app = express();
const musicRoutes = require('./routes/music');
app.use(express.static('public'));
// app.set('view engine', 'ejs');
app.use(musicRoutes);

app.listen(3000, () => {
    console.log('App is running on http://localhost:3000');
});