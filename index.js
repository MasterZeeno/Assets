document.addEventListener("DOMContentLoaded", event => {
    const video_type = "application/vnd.apple.mpegurl";

    const header = document.querySelector(".header");
    const profile = document.querySelector(".profile");
    const name = document.querySelector(".name");
    const name1 = document.querySelector(".name1");
    const name2 = document.querySelector(".name2");

    function splitName(name) {
        let names;
        if (name.includes(" ")) {
            names = name.split(" ");
        } else {
            const halfLen = Math.ceil(name.length / 2);
            names = [
                name.substring(0, halfLen),
                name.substring(halfLen, name.length)
            ];
        }
        name1.innerText = names[0];
        name2.innerText = names[1] || "";
    }

    const videoList = document.querySelector(".video-list");
    let lastPlayedVideo;

    function toggleFullScreen(video) {
        if (!document.fullscreenElement) {
            video.requestFullscreen();
            handleOrientationChange();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    function handleOrientationChange() {
        if (screen.orientation.type.startsWith("portrait")) {
            screen.orientation.lock("landscape");
        }
    }

    function pauseOthers(currentVid) {
        const videos = document.querySelectorAll("video");
        videos.forEach(otherVideo => {
            if (otherVideo !== currentVid && !otherVideo.paused) {
                otherVideo.pause();
                otherVideo.classList.add("notplaying");
            }
        });
    }

    function createVideoJs(video_source, image_source) {
        const player = document.createElement("video");
        player.setAttribute("class", "notplaying");
        player.setAttribute("poster", image_source);
        player.setAttribute("autoplay", "false");
        // player.setAttribute("muted", "false");
        player.setAttribute("name", "media");
        // player.setAttribute("controls", false); // Hide default controls
        const player_source = document.createElement("source");
        player_source.setAttribute("src", video_source);
        player_source.setAttribute("type", video_type);
        player.append(player_source);
        player.addEventListener("click", function () {
            if (player.paused) {
                player.play();
                player.classList.remove("notplaying");
                pauseOthers(player);
                toggleFullScreen(player);
                lastPlayedVideo = player;
            } else {
                player.pause();
                player.classList.add("notplaying");
            }
        });
        videoList.append(player);
    }

    url =
        "https://script.google.com/macros/s/AKfycbx__TeLYl-rasvQ2msCnxNI7MpZB4BBp2Xmm-ZcTppgvRnrc4uQnCGWyUZlk5mppcD9/exec";

    fetch(url)
        .then(response => response.json())
        .then(res => {
            header.style.backgroundImage = "url('" + res.header + "')";
            profile.setAttribute("src", res.profile);
            splitName(res.name);
            // name.innerText = res.name;
            res.urls.forEach(e => {
                if (e.video_url && e.image_url) {
                    createVideoJs(e.video_url, e.image_url);
                }
            });
        });

    document.addEventListener("fullscreenchange", function () {
        if (!document.fullscreenElement && lastPlayedVideo) {
            pauseOthers(lastPlayedVideo);
            // Pan to the last played video player
            setTimeout(() => {
                // Pan to the last played video player
                const rect = lastPlayedVideo.getBoundingClientRect();
                window.scrollTo({
                    top: rect.top + window.scrollY - rect.height,
                    left: rect.left + window.scrollX,
                    behavior: "smooth"
                });
            }, 500); // Adjust delay time as needed
        }
    });
});
