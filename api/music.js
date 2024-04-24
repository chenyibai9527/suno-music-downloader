const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const {
  generateStaticSongPages,writeNewMusicData
} = require("./staticSongPages");

const getMusicData = async () => {
   let response = await axios.get(
     "https://studio-api.suno.ai/api/playlist/1190bf92-10dc-4ce5-968a-7a377f37f984/?page=0"
   );
   let { playlist_clips } = response.data;
   let musicData = playlist_clips.map((clipData) => clipData.clip);
   return musicData;
};



router.get("/explore", async (req,res) => {
  try {
     let musicData = await getMusicData();
    //  写入musicData.json
     writeNewMusicData(musicData, path.join(__dirname, "../public/data"))
     .catch((error)=>console.error('Error writing music data:',error));
     
    // 创建静态页面
     generateStaticSongPages(musicData, path.join(__dirname, "../public/songs"));

     let renderedHTML = musicData
      .map((music,index) => {
        let tagsArray = music.metadata.tags.trim().split(",").filter((tag) => tag.trim() !== "");
        return `
        <div class="music-card">
          <div class="card-image">
            <img src="${music.image_url}" alt="${music.title}, suno ai work free download">

            <div class="play-pause-container">
              <i class="fas fa-play play-button" data-audio-url="${music.audio_url}" data-title="${music.title}" data-display_name="${music.display_name}"></i>
            </div>
          </div>

  <div class="card-content">
    <h3 class="music-title mx-4 my-4"><a href="/song/${music.id}">${music.title!=''?music.title:"No Title"}</a></h3>

    <div class="counts-and-tags">
      <div class="tags">
        <ul class="tags-list">
          ${tagsArray
          .map((tag) => 
           `<li class="tag">${tag}</li>`)
          .join("")}
          </ul>
      </div>
      <div class="counts">
        <p class="play-count"><i class="fas fa-headphones"></i><span class="count-value  pr-4">${music.play_count}</span></p>
        <p class="upvote-count"><i class="fas fa-thumbs-up"></i><span class="count-value pr-4">${music.upvote_count}</span></p>
      </div>
      <div class="download-guides">
      <p>Download:</p>
      </div>
      
        <div class="card-buttons">
            <button onclick="saveSong('${music.audio_url}','${music.title}')" class="mx-4 my-2 px-2 py-2 pl-4 pr-4 text-white bg-black hover:bg-opacity-75 rounded-full transition-colors duration-500">Mp3</button>
            <button onclick="saveVideo('${music.video_url}','${music.title}')" class="mx-4 my-2 px-2 py-2 pl-4 pr-4 text-black bg-yellow-500 hover:bg-opacity-75 rounded-full transition-colors duration-500">Video</button>
        </div>
    </div>
  </div>
</div>
    `;
      })
      .join("");

    res.send(`
        <html>
            <head>
                <title>Explore: Suno AI Song</title>
                <link rel="stylesheet" type="text/css" href="/styles.css">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/1.2.3/wavesurfer.min.js"></script>
                <script src="https://cdn.tailwindcss.com"></script>
                <script src="/script.js"></script>
                <!-- Google tag (gtag.js) -->
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-WR2B98ZPDD"></script>
                <script>
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'G-WR2B98ZPDD');
                </script>
                <script>
                  var _hmt = _hmt || [];
                  (function() {
                    var hm = document.createElement("script");
                    hm.src = "https://hm.baidu.com/hm.js?0f9634c88091ac0a95dcfd3e4fba8ef4";
                    var s = document.getElementsByTagName("script")[0]; 
                    s.parentNode.insertBefore(hm, s);
                  })();
                </script>

            </head>
            <body>
                <nav id="menu">
                    <ul>
                        <li><img class="logoimg" src="https://cdnjson.com/images/2024/04/16/downloadlogo82a56eef63760804.th.png" alt="suno ai download"></li>
                        <li><a href="/index.html">DOWNLOAD</a></li>
                        <li><a href="/explore">EXPLORE</a></li>
                    </ul>
                </nav>
              <div class="card-container"> 
                <div id="music-cards">
                        ${renderedHTML}
                </div> 
                  <div id="player-controls" class="flex items-center mt-2">
                    <div id="sixPlayer" class="bg-gray-800 p-4 mx-auto" >
                        <div class="flex items-center">
                            <div class="mx-3">
                                <h2 id="playerTitle" class="text-white text-lg">Song Name</h2>
                            </div>
                            
                            <button id="playPause" class="ml-auto bg-gray-700 p-2 rounded-full text-white hover:bg-opacity-75 rounded-full transition-colors duration-500">
                                Play
                            </button>
                        </div>

                        <div class="mt-2">
                          
                            
                            <div id="waveform"></div>
                        </div>
                        
                    </div>
                  </div>
                    <script>
                    window.musicData = ${JSON.stringify(musicData)};
                  </script>
                <script>
                window.onload = function() {
  // 创建一个 Wavesurfer 实例
  var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'white',
    progressColor: 'wheat',
    barGap: '11',
    barHeight: '40',
    barWidth: '2',
    minPxPerSec: '1',
    hideScrollbar: true,
    normalize: true,
    cursorWidth: '2',
    cursorColor: 'wheat',
    height: 40,
    dragToSeek:true,
    interact: true
  });

  let currentPlayingButton = null; // 存储当前正在播放的音乐卡片播放按钮
  let currentPlayingSong = null;

  // 获取所有的播放按钮
  let playButtons = document.querySelectorAll('.play-button');

  // 为所有的播放按钮添加点击事件监听器
  playButtons.forEach(button => {
  button.addEventListener('click', function() {
    let audioUrl = this.dataset.audioUrl;
    let title = this.dataset.title;
    let displayName = this.dataset.displayName;

    // 如果当前点击的播放按钮就是正在播放的按钮，且音频已加载，则仅控制播放/暂停状态，无需重新加载音频
    if (currentPlayingButton === this && wavesurfer.getDuration() > 0) {
      wavesurfer.playPause(); // 使用 wavesurfer.playPause() 方法自动处理播放/暂停状态

      // 根据播放器状态更新播放按钮图标和文本
      if (wavesurfer.isPlaying()) {
        playPauseButton.textContent = 'Pause';
        currentPlayingButton.classList.remove('fa-play');
        currentPlayingButton.classList.add('fa-pause');
      } else {
        playPauseButton.textContent = 'Play';
        currentPlayingButton.classList.remove('fa-pause');
        currentPlayingButton.classList.add('fa-play');
      }

      return;
    }

    // 更新标题和作者信息
    document.querySelector('#playPause').textContent = 'Pause';
    document.querySelector('.mx-3 h2').textContent = title;
    // document.querySelector('.mx-3 p').textContent = displayName;

    // 显示加载动画
    createLoader();

    // 加载音频文件
    wavesurfer.load(audioUrl)
    //隐藏加载动画
    removeLoader();

    // 清除当前正在播放的音乐卡片播放按钮
    if (currentPlayingButton) {
      currentPlayingButton.classList.remove('fa-pause');
      currentPlayingButton.classList.add('fa-play');
    }

    // 记录当前点击的播放按钮为正在播放的按钮
    currentPlayingButton = this;

    // 添加 ready 事件监听器，确保音频加载完成后开始播放
    wavesurfer.once('ready', function() {
      wavesurfer.play();

      // 切换当前播放按钮的图标
      currentPlayingButton.classList.remove('fa-play');
      currentPlayingButton.classList.add('fa-pause');
    });
  });
});

  

  // 获取播放暂停按钮元素
  let playPauseButton = document.querySelector("#playPause");

  // 注册点击事件
  playPauseButton.addEventListener("click", function() {
    //如果没有歌曲加载到播放器中
    if(!wavesurfer.backend.buffer) {
      // 获取并加载播放列表中的第一首歌曲
      const musicData = window.musicData;
      if(!musicData){
        console.log("No music data found.");
        return;
      }
      // 随机选择一首歌曲
      let songIndex = Math.floor(Math.random() * (49 + 1));
      const firstSong = musicData[songIndex];
      const firstSongUrl = firstSong.audio_url;
      const firstSongTitle = firstSong.title;

      wavesurfer.load(firstSongUrl);
      createLoader();

      //等待歌曲加载完成后再处理播放/暂停逻辑
      wavesurfer.once('ready',()=> {
        handlePlayPauseClick();
        removeLoader();
        // 赋值标题给播放器
        document.querySelector('#playerTitle').textContent = firstSongTitle;
        
      });
    } else {
      handlePlayPauseClick();
      // 赋值标题给播放器
        document.querySelector('.text-white .text-lg').textContent = firstSongTitle;
    }
  });

  function handlePlayPauseClick(){
    // 检查当前播放器是否在播放
    if (wavesurfer.isPlaying()) {
      // 如果在播放，则暂停
      wavesurfer.pause();
      playPauseButton.textContent = 'Play';

      // 切换当前播放按钮的图标（如果需要）
      if (currentPlayingButton) {
        currentPlayingButton.classList.remove('fa-pause');
        currentPlayingButton.classList.add('fa-play');
      }
    } else {
      // 如果没有播放，则播放
      wavesurfer.play();
      playPauseButton.textContent = 'Pause';

      // 切换当前播放按钮的图标（如果需要）
      if (currentPlayingButton) {
        currentPlayingButton.classList.remove('fa-play');
        currentPlayingButton.classList.add('fa-pause');
      }
    }
  }
  };

  
                </script>
            </body>
            </html>
        `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
});

// 创建新的路由
router.get('/song/:id',async(req,res) =>{
  const {id} = req.params;//获取请求路径中的id参数
  
  // 调用getmusicData函数获取音乐列表数据
  const musicData = await getMusicData();

  // 根据id查找对应的音乐对象
  const selectedSong = musicData.find((song) =>song.id === id);

  if(!selectedSong){
    const staticSongPath = path.join(
      __dirname,
      "..",
      "public",
      "songs,"`${id}.html`
    );
    try {
      const fileExists = fs.existSync(staticSongPath);
      if(fileExists){
        res.sendFile(staticSongPath);
        return;
      }
    } catch (error){
      console.error('Error checking or sending static song page:',error);
    }
    return res.status(404).send("Song not found.");
  }
  // 将musicaData 转为JSON字符串并写入响应头
  const musicDataJson = JSON.stringify(musicData);
  const musicDataScript = `<script>window.musicData = ${musicDataJson};</script>`;

  //渲染歌曲详情页
  res.send(`
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${selectedSong.title}:Usesono to create songs like this</title>
    <link rel="icon" type="image/png" href="/favicon.ico">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css"/>
    <link rel="stylesheet" href="/music-style.css">
    <link rel="stylesheet" href="/star.css">
    <script src="https://unpkg.com/wavesurfer.js"></script>
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

            <img class="tilt" id= "photo" alt="album cover" src="${selectedSong.image_url}" />    
        </div>
        <audio src="${selectedSong.audio_url}"></audio>
        <h2 id=" title ">${selectedSong.title!=""?selectedSong.title:"No Title"}</h2>
        <h3 id=" artist ">${selectedSong.display_name}</h3>


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

<script type="text/javascript" src="/titlt.js"> 
</script>
<script>
    VanillaTilt.init(document.querySelector(".tilt"), {
        max: 25,
        speed: 400,
        glare:true,
        "max-glare":1,

    });
</script>
${musicDataScript}
<script src="/music-script.js"></script>
</body>
</html>
  `);
});

module.exports = {
  router,
  getMusicData,
};
