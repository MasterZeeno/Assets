window.addEventListener("load", event => {
    const video_type = "application/vnd.apple.mpegurl";

    const header = document.querySelector(".header");
    const profile = document.querySelector(".profile");
    const name = document.querySelector(".name");

    const videoList = document.querySelector(".video-list");

    function createVideoJs(video_source, image_source) {
        const player = document.createElement("video");
        player.setAttribute("poster", image_source);
        // player.setAttribute("controls", "");
        player.setAttribute("autoplay", "");
        player.setAttribute("muted", "false");
        player.setAttribute("name", "media");
        const player_source = document.createElement("source");
        player_source.setAttribute("src", video_source);
        player_source.setAttribute("type", video_type);
        player.append(player_source);
        player.addEventListener("click", handleVideoPlayPause);
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

    const videos = document.querySelectorAll("video");

    // Function to check if an element is in the center of the viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
                (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <=
                (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to play or pause videos based on center alignment
    function handleVideoPlayPause(video) {
        if (isElementInViewport(video)) {
            if (video.paused) {
                video.play();
                videos.forEach(otherVideo => {
                    if (otherVideo !== video && !otherVideo.paused) {
                        otherVideo.pause();
                    }
                });
            }
        } else {
            video.pause();
        }
    }
    // Event listener to handle scroll and resize events
    window.addEventListener("scroll", handleVideoPlayPause);
    window.addEventListener("resize", handleVideoPlayPause);

    // Initial check when the page loads
    handleVideoPlayPause();
});
