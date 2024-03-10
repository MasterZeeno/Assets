document.addEventListener("DOMContentLoaded", event => {
    const video_type = "application/vnd.apple.mpegurl";

    const header = document.querySelector(".header");
    const profile = document.querySelector(".profile");
    const name = document.querySelector(".name");

    const videoList = document.querySelector(".video-list");

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

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
            if (this.paused) {
                this.play();
                this.classList.remove("notplaying");
                const videos = document.querySelectorAll("video");

                videos.forEach(otherVideo => {
                    if (otherVideo !== this && !otherVideo.paused) {
                        otherVideo.pause();
                        otherVideo.classList.add("notplaying");
                    }
                });
                this.requestFullscreen();
            } else {
                this.pause();
                this.classList.add("notplaying");
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
            header.style.backgroundImage = "url('" + res.header + "')";

            profile.setAttribute("src", res.profile);

            name.innerText = res.name;

            res.urls.forEach(e => {
                if (e.video_url && e.image_url) {
                    createVideoJs(e.video_url, e.image_url);
                }
            });
            toggleFullScreen();
        });
});
