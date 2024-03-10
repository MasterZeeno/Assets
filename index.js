window.addEventListener("DOMContentLoaded", event => {
    const video_type = "application/vnd.apple.mpegurl";

    const header = document.querySelector(".header");
    const profile = document.querySelector(".profile");
    const name = document.querySelector(".name");

    const videoList = document.querySelector(".video-list");

    function createVideoJs(video_source, image_source) {
        const player = document.createElement("video");
        player.setAttribute("class", "notplaying");
        player.setAttribute("poster", image_source);
        // player.setAttribute("controls", "");
        player.setAttribute("autoplay", "");
        player.setAttribute("muted", "false");
        player.setAttribute("name", "media");
        const player_source = document.createElement("source");
        player_source.setAttribute("src", video_source);
        player_source.setAttribute("type", video_type);
        player.append(player_source);
        player.addEventListener("click", function () {
            if (player.paused) {
                player.classList.remove("notplaying");
                player.play();
                const videos = document.querySelectorAll("video");

                videos.forEach(otherVideo => {
                    if (otherVideo !== player && !otherVideo.paused) {
                        player.classList.add("notplaying");
                        otherVideo.pause();
                    }
                });
            } else {
                player.classList.add("notplaying");
                player.pause();
            }
        });
        videoList.append(player);
        // player.load();
    }

    url =
        "https://script.google.com/macros/s/AKfycbx__TeLYl-rasvQ2msCnxNI7MpZB4BBp2Xmm-ZcTppgvRnrc4uQnCGWyUZlk5mppcD9/exec";

    fetch(url)
        .then(response => response.json())
        .then(res => {
            header.setAttribute("src", res.header);

            profile.setAttribute("src", res.profile);

            name.innerText = res.name;

            res.urls.forEach(e => {
                if (e.video_url && e.image_url) {
                    createVideoJs(e.video_url, e.image_url);
                }
            });
        });
});
