
function createLoader() {
    // 创建 overlayDiv，并添加到 body
    let overlayDiv = document.createElement("div");
    overlayDiv.id = "overlay";
    document.body.appendChild(overlayDiv);

    // 创建 loaderContainerDiv，并添加到 overlayDiv
    let loaderContainerDiv = document.createElement("div");
    loaderContainerDiv.id = "loader-container";
    overlayDiv.appendChild(loaderContainerDiv);

    // 创建 loaderDiv，并添加到 loaderContainerDiv
    let loaderDiv = document.createElement("div");
    loaderDiv.id = "loader";
    loaderContainerDiv.appendChild(loaderDiv);

    // 创建 loadingTextDiv，并添加到 loaderContainerDiv
    let loadingTextDiv = document.createElement("div");
    loadingTextDiv.id = "loading-text";
    loadingTextDiv.innerHTML = "Downloading";
    loaderContainerDiv.appendChild(loadingTextDiv);
}

function removeLoader() {
    let loaderDiv = document.getElementById("loader");
    let loadingTextDiv = document.getElementById("loading-text");
    let loaderContainerDiv = document.getElementById("loader-container");
    let overlayDiv = document.getElementById("overlay");

    setTimeout(() => {

        if (loaderDiv) {
            loaderContainerDiv.removeChild(loaderDiv);
        }
        if (loadingTextDiv) {
            loaderContainerDiv.removeChild(loadingTextDiv);
        }
        if (loaderContainerDiv) {
            overlayDiv.body.removeChild(loaderContainerDiv);
        }
        if (overlayDiv) {
            document.body.removeChild(overlayDiv);
        }
    }, 1500);
}

function downloadSong() {
    const input = document.getElementById('songUrl');
    //正确的链接格式：https://suno.ai/song/songid/,或者https://suno.com/songs/songid/
    //正确识别songid
    if (!input.value.startsWith("https://suno.ai/song/") && !input.value.startsWith("https://suno.com/song/")) {
        alert("your share link is not correct");//提示错误
        return;
    }
    createLoader();
    //提取songid,如果链接格式为"https://suno.ai/song/songid/",则自动识别“song”后面两个"/"中间的songid
    let parts = input.value.split("/");
    if(parts[parts.length - 1]===""){
        parts.pop();
    }
    const songId = parts.pop();
    const songUrl = `https://cdn1.suno.ai/${songId}.mp3`;
    
    // use the fetch API to download the file
    fetch(songUrl)
        .then(response => response.blob())
        .then(blob => {
            // build a URL from the file
            const url = window.URL.createObjectURL(blob);

            // create a link and set it to the file URL
            const link = document.createElement('a');
            link.href = url;
            link.download = `${songId}.mp3`;

            // programmatically click the link to trigger the download
            link.click();

            // release the reference to the file by revoking the URL
            window.URL.revokeObjectURL(url);
        });
    removeLoader();
}
function downloadVideo() {
    
    const input = document.getElementById('songUrl');
    //正确的链接格式：https://suno.ai/song/songid/,或者https://suno.com/songs/songid/
    //正确识别songid
    if (!input.value.startsWith("https://suno.ai/song/") && !input.value.startsWith("https://suno.com/song/")) {
        alert("your share link is not correct");//提示错误
        return;
    }
    //提取songid,如果链接格式为"https://suno.ai/song/songid/",则自动识别“song”后面两个"/"中间的songid
    let parts = input.value.split("/");
    if(parts[parts.length - 1]===""){
        parts.pop();
    }
    const songId = parts.pop();
    const songUrl = `https://cdn1.suno.ai/${songId}.mp4`;
    
    createLoader();
    // use the fetch API to download the file
    fetch(songUrl)
        .then(response => response.blob())
        .then(blob => {
            // build a URL from the file
            const url = window.URL.createObjectURL(blob);

            // create a link and set it to the file URL
            const link = document.createElement('a');
            link.href = url;
            link.download = `${songId}.mp4`;

            // programmatically click the link to trigger the download
            link.click();

            // release the reference to the file by revoking the URL
            window.URL.revokeObjectURL(url);
        });
    removeLoader();
}
