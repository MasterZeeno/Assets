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
        if (
            !document.fullscreenElement &&
            video &&
            screen.orientation.type.startsWith("portrait")
        ) {
            video.requestFullscreen();
            screen.orientation.lock("landscape");
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    function pauseOthers(currentVid) {
        videos.forEach(otherVideo => {
            if (otherVideo !== currentVid && !otherVideo.paused) {
                otherVideo.pause();
                otherVideo.classList.toggle("notplaying", otherVideo.paused);
            }
        });
    }

    function createVideoJs(video_source, image_source) {
        const player = document.createElement("video");
        const attributes = {
            class: "notready",
            poster: image_source,
            autoplay: "false",
            preload: "metadata",
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
            if (player.paused && player.readyState > 1) {
                player.play();
                toggleFullScreen(player);
                pauseOthers(player);
                // pauseOthers(player);
            } else {
                player.pause();
            }
            player.classList.toggle("notplaying", player.paused);
        });

        player.onplaying = function () {
            lastPlayedVideo = player;
        };

        player.oncanplay = function () {
            setTimeout(() => {
                player.classList.remove("notready");
                player.classList.add("notplaying");
            }, 1000);
        };

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
                        prev.innerText = "Prev";
                        pager.append(prev);
                    }
                    if (currentPage >= 1 && currentPage <= lastPage) {
                        const curr = document.createElement("button");
                        curr.classList.add("current");
                        curr.innerText = currPage;
                        pager.append(curr);
                    }
                    if (currentPage < lastPage) {
                        const next = document.createElement("button");
                        next.innerText = "Next";
                        pager.append(next);
                    }
                }

                // Query for all videos after they are added to the DOM
                videos = document.querySelectorAll("video");
            }
        );

    document.addEventListener("fullscreenchange", function () {
        lastPlayedVideo.classList.toggle(
            "fullScreen",
            document.fullscreenElement
        );
        if (!document.fullscreenElement && lastPlayedVideo) {
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
