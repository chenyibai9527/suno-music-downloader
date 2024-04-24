const fs = require("fs");
const path = require("path");
async function generateStaticSongPage(
  song,
  filePath) {
    try{
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="find ${
      song.title
    } mp3 on sunoai.work,Usesuno to create songs like this.">
    <meta name="keywords" content="${
      song.title != ""
        ? song.title
        : "You have found a no title song"
    },${song.display_name},${
    song.metadata.prompt
  },Usesuno.com,Usesuno to create songs like this,find more infomation on sunoai.work">
    <title>${
      song.title
    }:Usesuno to create songs like this,find more infomation on sunoai.work</title>
    <link rel="icon" type="image/png" href="/favicon.ico">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css"/>
    <link rel="stylesheet" href="../music-style.css">
    <link rel="stylesheet" href="../star.css">
    <script src="https://unpkg.com/wavesurfer.js"></script>
    <script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?0f9634c88091ac0a95dcfd3e4fba8ef4";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-WR2B98ZPDD"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WR2B98ZPDD');
</script>
</head>
<body>
    <div class="circle"></div>     
    <div class="layer1"></div>
    <div class="layer2"></div>
    <div class="layer3"></div>
    <div class="layer4"></div>
    <div class="layer5"></div>
    <div class="container">
       
        <div class="img-container tilt">

            <img class="tilt" id= "photo" alt="${
              song.title != "" ? song.title : "No Title"
            }:Usesuno to create songs like this,find more infomation on sunoai.work" src="${
    song.image_url
  }" />    
        </div>
        <audio src="${song.audio_url}"></audio>
        <h2 id=" title ">${
          song.title != "" ? song.title : "No Title"
        }</h2>
        <h3 id=" artist ">${song.display_name}</h3>


        <div class="progress-container" id ="progress-container">
            <div class="progress" id="progress"></div>
            <div class="duration-wrapper">
                <span id="current-time">0:00</span>
                <span id="duration">2:00</span>
            </div>

            <div class="player-controls">
                <i class="fas fa-backward" id="prev" title="Previous"></i>
                <i class="fas fa-play main-button" id="play" title="Play"></i>
                <i class="fas fa-forward" id="next" title="Next"></i>
            </div>
    </div>
</div>

<script type="text/javascript" src="../titlt.js"> 
</script>
<script>
    VanillaTilt.init(document.querySelector(".tilt"), {
        max: 25,
        speed: 400,
        glare:true,
        "max-glare":1,

    });
</script>
<script src="../music-script.js"></script>
</body>
</html>`;
  console.log(`Attempting to write song page to ${filePath}`);
  await fs.promises.writeFile(filePath, htmlTemplate);
  console.log(`Successfully wrote song page to ${filePath}`);
    }catch(err){
        console.log("出错了",err);
    }
}
async function generateStaticSongPages(musicData,songsFolderPath){
    
//   for (const song of musicData) {
//     console.log(`循环次数: ${++loopCount}`);
//     console.log("数组的长度",musicData.length);
//     const filePath = path.join(songsFolderPath, `${song.id}.html`);
//     const fileExists = await fs.promises.access(filePath).then(()=> true,()=> false);
//     if(!fileExists){
//     try{
//         await generateStaticSongPage(song, filePath);
//         console.log(`Generated static song page for ${song.title}`);
//     }catch(error){
//         console.log(
//           `Error generating static song page for ${song.title}`,
//           error
//         );
//     }
//    }
//   }
    const chunkSize = 10;
    const chunks = [];
    let loopCount = 0;
    let chunkcount = 0;
    console.log("数组的完整内容",musicData);

    for (let i = 0; i < musicData.length; i += chunkSize) {
      chunks.push(musicData.slice(i, i + chunkSize));
    }

    for(const chunk of chunks) {
            console.log(`第几个chunk: ${++chunkcount}`);
        for (const song of chunk) {
            console.log(`循环次数: ${++loopCount}`);
            console.log("chunk的长度",chunk.length);
            const filePath = path.join(songsFolderPath, `${song.id}.html`);
            const fileExists = await fs.promises.access(filePath).then(()=> true,()=> false);
            if(!fileExists){
            try{
                await generateStaticSongPage(song, filePath);
                console.log(`Generated static song page for ${song.title}`);
            }catch(error){
                console.log(
                `Error generating static song page for ${song.title}`,
                error
                );
            }
        }
        }
    }
}

module.exports = {
    generateStaticSongPages,
};