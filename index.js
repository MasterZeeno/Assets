document.addEventListener("DOMContentLoaded", event => {
    const video_type = "application/vnd.apple.mpegurl";

    const header = document.querySelector(".header");
    const profile = document.querySelector(".profile");
    const name = document.querySelector(".name");

    const videoList = document.querySelector(".video-list");
    let lastPlayedVideo;

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    function handleOrientationChange() {
        if (screen.orientation.type.startsWith('portrait')) {
            screen.orientation.lock('landscape');
        }
    }

    function createVideoJs(video_source, image_source) {
        const player = document.createElement("video");
        player.setAttribute("class", "notplaying");
        player.setAttribute("poster", image_source);
        player.setAttribute("autoplay", "");
        player.setAttribute("muted", "false");
        player.setAttribute("name", "media");
        // player.setAttribute("controls", false); // Hide default controls
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
                lastPlayedVideo = this;
            } else {
                this.pause();
                this.classList.add("notplaying");
            }
        });
        videoList.append(player);
    }

    const exitFullscreenButton = document.createElement("button");
    exitFullscreenButton.innerText = "Exit Fullscreen";
    exitFullscreenButton.addEventListener("click", () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    });

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

    document.addEventListener('fullscreenchange', function() {
        if (!document.fullscreenElement && lastPlayedVideo) {
            // Centering last played video player
            const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
            const playerWidth = lastPlayedVideo.offsetWidth;
            const playerHeight = lastPlayedVideo.offsetHeight;
            const left = (viewportWidth - playerWidth) / 2;
            const top = (viewportHeight - playerHeight) / 2;
            lastPlayedVideo.style.position = 'absolute';
            lastPlayedVideo.style.left = left + 'px';
            lastPlayedVideo.style.top = top + 'px';
        }
    });
});
