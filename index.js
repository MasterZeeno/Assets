window.addEventListener("DOMContentLoaded", event => {
    const video_type = "application/vnd.apple.mpegurl";
    const video_src = [
        "https://surrit.com:443/e472ea27-4567-40e7-ae93-afaf0dad32ba/1920x1080/video.m3u8",
        "https://surrit.com:443/ae1bc5e3-3cc3-4bc5-9baa-eeef9e30130c/1920x1080/video.m3u8",
        "https://surrit.com:443/ebd0252a-5495-4118-9697-a41640d82aba/1920x1080/video.m3u8",
        "https://surrit.com:443/aaed0cc7-05fa-4fcf-ac50-a7353d7f5303/1280x720/video.m3u8",
        "https://surrit.com:443/bb6e5e41-c2e7-4433-96d8-afd8f488157c/1280x720/video.m3u8",
        "https://surrit.com:443/f8cbf25c-619e-44dd-83d4-61050bb2e1d8/1280x720/video.m3u8",
        "https://surrit.com:443/fefc6090-8775-4654-8a5e-200641c9622d/1280x720/video.m3u8"
    ];

    const videoList = document.querySelector(".video-list");

    function createVideoJs(source) {
        const player = document.createElement("video");
        // player.setAttribute("class", "video-js vjs-fluid vjs-controls-enabled vjs-touch-enabled");
        player.setAttribute("controls", "");
        player.setAttribute("autoplay", "");
        player.setAttribute("muted", "");
        player.setAttribute("loop", "");
        // player.setAttribute("preload", "metadata");
        const player_source = document.createElement("source");
        player_source.setAttribute("src", source);
        player_source.setAttribute("type", video_type);
        // player.setAttribute("data-setup", "{}");
        player.append(player_source);
        videoList.append(player);
        player.load();
    }
    
    video_src.forEach(v_src => {
        createVideoJs(v_src);
    });
});
