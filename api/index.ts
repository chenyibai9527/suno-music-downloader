const express = require('express');
const axios = require('axios');
const app = express();
const musicRoutes = require('./music');
app.use(express.static('public'));
// app.set('view engine', 'ejs');
app.use(musicRoutes);

module.exports = app; 