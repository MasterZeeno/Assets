document.addEventListener("DOMContentLoaded", event => {
    const video_type = "application/vnd.apple.mpegurl";

    const header = document.querySelector(".header");
    const profile = document.querySelector(".profile");
    const name1 = document.querySelector(".name1");
    const name2 = document.querySelector(".name2");
    const videoList = document.querySelector(".video-list");
    const pager = document.querySelector(".pager");

    let lastPlayedVideo;
    let videos;

    function splitName(name) {
        const names = name.includes(" ")
            ? name.split(" ")
            : [
                  name.slice(0, Math.ceil(name.length / 2)),
                  name.slice(Math.ceil(name.length / 2))
              ];
        [name1.innerText, name2.innerText] = names;
    }

    function toggleFullScreen(video) {
        if (!document.fullscreenElement) {
            video.requestFullscreen();
            video.classList.add("fullScreen");
            if (screen.orientation.type.startsWith("portrait")) {
                screen.orientation.lock("landscape");
            }
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    function pauseOthers(currentVid) {
        videos.forEach(otherVideo => {
            if (otherVideo !== currentVid && !otherVideo.paused) {
                otherVideo.pause();
                otherVideo.classList.add("notplaying");
            }
        });
    }

    function createVideoJs(video_source, image_source) {
        const player = document.createElement("video");
        const attributes = {
            class: "notplaying",
            poster: image_source,
            autoplay: "false",
            preload: "none",
            name: "media"
        };

        Object.keys(attributes).forEach(key =>
            player.setAttribute(key, attributes[key])
        );

        const player_source = document.createElement("source");
        player_source.setAttribute("src", video_source);
        player_source.setAttribute("type", video_type);
        player.append(player_source);

        player.addEventListener("click", function () {
            if (player.paused) {
                player.classList.remove("notplaying");
                player.play();
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

    const url =
        "https://script.google.com/macros/s/AKfycbx__TeLYl-rasvQ2msCnxNI7MpZB4BBp2Xmm-ZcTppgvRnrc4uQnCGWyUZlk5mppcD9/exec";

    fetch(url)
        .then(response => response.json())
        .then(
            ({
                header: headerImg,
                profile: profileImg,
                name,
                currPage,
                lastPage,
                urls
            }) => {
                header.style.backgroundImage = `url('${headerImg}')`;
                profile.setAttribute("src", profileImg);
                splitName(name);

                urls.forEach(({ video_url, image_url }) => {
                    if (video_url && image_url) {
                        createVideoJs(video_url, image_url);
                    }
                });
                const currentPage = Number(currPage) || null;
                if (currentPage) {
                    if (currentPage > 1) {
                        const prev = document.createElement("button");
                        prev.text = "Prev";
                    }
                    if (currentPage >= 1 && currentPage <= lastPage) {
                        const curr = document.createElement("button");
                        curr.classList.add("current");
                        curr.text = currPage;
                        pager.append(curr);
                    }
                    if (currentPage < lastPage) {
                        const next = document.createElement("button");
                        next.text = "Next";
                        pager.append(last);
                    }
                }

                // Query for all videos after they are added to the DOM
                videos = document.querySelectorAll("video");
            }
        );

    document.addEventListener("fullscreenchange", function () {
        if (!document.fullscreenElement && lastPlayedVideo) {
            pauseOthers(lastPlayedVideo);
            lastPlayedVideo.classList.remove("fullScreen");
            setTimeout(() => {
                const rect = lastPlayedVideo.getBoundingClientRect();
                window.scrollTo({
                    top: rect.top + window.scrollY - rect.height,
                    left: rect.left + window.scrollX,
                    behavior: "smooth"
                });
            }, 500);
        }
    });
});
