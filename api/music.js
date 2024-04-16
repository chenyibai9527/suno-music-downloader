const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/explore', async (req, res) => {
    try {
        let response = await axios.get('https://studio-api.suno.ai/api/playlist/1190bf92-10dc-4ce5-968a-7a377f37f984/?page=0');
        let { playlist_clips } = response.data;
        let musicData = playlist_clips.map(clipData => clipData.clip);

        let renderedHTML = musicData.map(music => {
            return `
                <div class="music-card">
                    <img src="${music.image_large_url}" alt="${music.title}">
                    <h3>${music.title}</h3>
                    <audio controls controlsList="nodownload">
                      <source src="${music.audio_url}" type="audio/mpeg">
                      Your browser does not support the audio element.
                    </audio>
                    <a href="${music.video_url}" target="_blank">Watch Video</a>
                </div>
            `;
        }).join('');

        res.send(`
            <html>
            <head>
                <title>Explore: Suno AI Song</title>
                <link rel="stylesheet" type="text/css" href="/styles.css">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
                <body>
                <nav id="menu">
                    <ul>
                        <li><img class="logoimg" src="https://cdnjson.com/images/2024/04/16/downloadlogo82a56eef63760804.th.png" alt="suno ai download"></li>
                        <li><a href="/index.html">DOWNLOAD</a></li>
                        <li><a href="/explore">EXPLORE</a></li>
                    </ul>
                </nav>
                    <div id="music-cards">
                        ${renderedHTML}
                    </div>
                </body>
            </html>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong.');
    }
});

module.exports = router;