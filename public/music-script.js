const image = document.getElementById("photo");
const backImage = document.getElementById("full");
const title = document.querySelector("h2");
const artist = document.querySelector("h3");
const music = document.querySelector("audio");
const durationEl = document.getElementById("duration");
const currentTimeEl = document.getElementById("current-time");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const musicData = window.musicData;

let isPlaying = false;
let savedCurrentTime = 0;
function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "play");
  savedCurrentTime = music.currentTime;
  music.pause();
}

function playSong() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "pause");
  if (music.src !== musicData[getCurrentSongIndex()].audio_url) {
    music.currentTime = 0;
  } else {
    music.currentTime = savedCurrentTime;
  }

  if (!music.readyState >= 3) {
    // Check if the audio has loaded enough to play
    music.addEventListener("canplaythrough", () => {
      music.play();
    });
  } else {
    music.play();
  }
}

playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));

//update the dom

const allSongIds = musicData.map((song) => song.id);

let currentSongId = window.location.pathname.split("/")[2];
console.log('当前歌曲id',currentSongId)

function getCurrentSongIndex() {
  return allSongIds.indexOf(currentSongId);

}

function getNextSongIndex() {
  const currentIndex = getCurrentSongIndex();
  const nextIndex = (currentIndex + 1) % allSongIds.length;
  return nextIndex;
}

function getPrevSongIndex() {
  const currentIndex = getCurrentSongIndex();
  const prevIndex = (currentIndex - 1 + allSongIds.length) % allSongIds.length;
  return prevIndex;
}



function updateSongMetadata(index) {
  const currentSong = musicData[index];

  // Update song metadata in the DOM (title, artist, image, etc.)
  // You need to adjust these lines based on your actual HTML structure
  if(currentSong.title!=''){
  title.textContent = currentSong.title;
  }else {
    title.textContent = "No Title";
  }
  
  artist.textContent = currentSong.display_name;
  image.src = currentSong.image_url;
}

function navigateToSongIndex(index) {
  currentSongId = allSongIds[index];
  updateSongMetadata(index);
  music.src = musicData[index].audio_url;
  music.currentTime = 0;
  savedCurrentTime = 0;
  document.title = `${musicData[index].title} - ${musicData[index].display_name}:Use suno to create your own song like this`;
  playSong();
}



prevBtn.addEventListener("click", () => {
  const prevSongIndex = getPrevSongIndex();
  console.log('上一首歌索引',prevSongIndex);
  navigateToSongIndex(prevSongIndex);
});

nextBtn.addEventListener("click", () => {
  const nextSongIndex = getNextSongIndex();
  console.log('下一首歌索引',nextSongIndex);
  navigateToSongIndex(nextSongIndex);
});


function updateProgress(e) {
  if (isPlaying) {
    const { duration, currentTime } = e.srcElement;
    // update progress bar width

    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Calculate display for duration
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`;
    }
    // to avoid NaN
    if (durationSeconds) {
      durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    }
    // Calculate display for currentTime
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
      currentSeconds = `0${currentSeconds}`;
    }
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
  }
}

function setProgressBar(e) {
  
  const containerRect = this.getBoundingClientRect();
  const clickX = e.clientX - containerRect.left;
  const width = this.clientWidth;

  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
  console.log('设置的当前播放时间',music.currentTime);
}

music.addEventListener("timeupdate", updateProgress);
progress.addEventListener("click", setProgressBar);

