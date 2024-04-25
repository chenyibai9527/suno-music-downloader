const fs = require("fs");
const path = require("path");
// 新增依赖
const { isEqual } = require("lodash");
const moment = require("moment");


// 新增函数：从/public/data/musicData.json中读取并解析音乐数据
function readCachedMusicData(dataFolderPath){
  const musicDataFilePath = path.join(dataFolderPath, "musicData.json");

  try{
    const cachedDataStr = fs.readFileSync(musicDataFilePath, "utf-8");
    return JSON.parse(cachedDataStr);
  }catch(error){
    console.warn('Failed to read or parse cached music data:',error);
    return null;
  }
}

// 新增函数：获取当前时间戳（格式：YYYY-MM-DD_HH-mm-ss）
function getCurrentTimestamp(format = 'YYYY-MM-DD_HH-mm-ss'){
    const date = new Date();
    const year = String(date.getFullYear()).padStart(4, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    switch(format){
        case 'YYYY_MM_DD_HH_mm_ss':
            return `${year}_${month}_${day}_${hour}_${minute}_${second}`;
        default:
            return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
    }
}

// 新增函数：写入新的音乐数据
async function writeNewMusicData(musicData, dataFolderPath) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`; // 使用原生JavaScript格式化日期

  const fileName = `${dateStr}.json`;
  const newPath = path.join(dataFolderPath, fileName);

  try {
    // 读取已有的musicData.json文件
    const musicDataJsonPath = path.join(dataFolderPath, "musicData.json");
    const files = await fs.promises.readdir(dataFolderPath);
    const existingDateFiles = files.filter((file) =>
      /^(\d{4}-\d{2}-\d{2})\.json$/.test(file)
    );
    const existingMusicDataStr = await fs.promises.readFile(musicDataJsonPath, "utf-8");
    const existingMusicData = JSON.parse(existingMusicDataStr);

    // 更新已有音乐对象的play_count和unvote_count,或插入新音乐对象
    musicData.forEach((newMusic)=>{
      const existingMusic = existingMusicData.find((music) => music.id === newMusic.id);
      if(existingMusic){
        existingMusic.play_count = newMusic.play_count;
        existingMusic.unvote_count = newMusic.unvote_count;
        console.log(`Updated play_count and unvote_count for music with ID: ${newMusic.id}`);
      }else {
        existingMusicData.push(newMusic);
      }
    });

    // 更新musicData.json 文件内容
    const updateMusicDataStr = JSON.stringify(existingMusicData, null, 2);
    await fs.promises.writeFile(musicDataJsonPath, updateMusicDataStr);
    console.log("Successfully updated musicData.json");


    // 继续执行原油逻辑，写入日期命名的json文件
    if (existingDateFiles.length > 0) {
      const existingDateStr = existingDateFiles.sort()[0].split(".")[0];
      // 检查是否存在当天的文件
      if (existingDateStr !== dateStr) {
        // 文件日期与当前日期不同，直接写入新文件
        const jsonDataString = JSON.stringify(musicData, null, 2);
        await fs.promises.writeFile(newPath, jsonDataString);
        console.log(`Successfully wrote updated musicData to ${newPath}`);
      } else {
        console.log("No need to update YYYY-MM-DDJson. Today's file already exists.");
      }
    } else {
      // 文件不存在，直接写入
      const jsonDataString = JSON.stringify(musicData, null, 2);
      await fs.promises.writeFile(newPath, jsonDataString);
      console.log(`Successfully wrote updated musicData to ${newPath}`);
    }
  } catch (err) {
    console.error("Error accessing or writing JSON file:", err);
    // 更复杂的错误处理逻辑可以在这里实现，例如重试机制
  }

  // 确保路径安全性
  if (!dataFolderPath.startsWith(process.cwd())) {
    console.error("Invalid dataFolderPath, potential directory traversal detected.");
    // 抛出错误或进行其他适当的处理
  }
}


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

    for (let i = 0; i < musicData.length; i += chunkSize) {
      chunks.push(musicData.slice(i, i + chunkSize));
    }

    for(const chunk of chunks) {
            // console.log(`第几个chunk: ${++chunkcount}`);
        for (const song of chunk) {
            // console.log(`循环次数: ${++loopCount}`);
            // console.log("chunk的长度",chunk.length);
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
    writeNewMusicData,
    readCachedMusicData,
};