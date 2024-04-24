const express = require("express");
const axios = require("axios");
const app = express();
const musicRoutes = require("./music").router;
const {getMusicData} = require("./music");
const generateStaticSongPages = require("./staticSongPages");
app.use(express.static("public"));
app.use(musicRoutes);


module.exports = app;
