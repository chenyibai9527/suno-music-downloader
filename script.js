function downloadSong() {
    const input = document.getElementById('songUrl');
    const songId = input.value.split("/").pop();
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
}

function showSong(){
    const input = document.getElementById('songUrl');
    fetch(input)
            .then(response => {
                // 确保请求成功，否则抛出异常
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();  // 解析JSON数据 
            })
            .then(data => {
                // 这里的data就是服务器返回的数据
                const lyrics = data[8];
                const songInformation = data[2];
                const songLyrics = lyrics.replace(/\\n/g, '\n');
                return {
                    image_url: songInformation[1][3]["image_url"],
                    audio_url: songInformation[1][3]["audio_url"],
                    lyrics: songLyrics
                }
            })
}