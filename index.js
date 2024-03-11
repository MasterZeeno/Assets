document.addEventListener("DOMContentLoaded", () => {
            const videoType = "application/vnd.apple.mpegurl";
            const header = document.querySelector(".header");
            const profile = document.querySelector(".profile");
            const name1 = document.querySelector(".name1");
            const name2 = document.querySelector(".name2");
            const videoList = document.querySelector(".video-list");
            const pager = document.querySelector(".pager");

            let lastPlayedVideo;
            let videos = [];

            function splitName(name) {
                const [firstName, lastName] = name.split(" ");
                name1.textContent = firstName;
                name2.textContent = lastName || "";
            }

            function toggleFullScreen(video) {
                if (!document.fullscreenElement && video && screen.orientation.type.startsWith("portrait")) {
                    video.requestFullscreen().then(() => {
                        screen.orientation.lock("landscape");
                    }).catch(console.error);
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

            function createVideoJs(videoSource, imageSource) {
                const player = document.createElement("video");
                player.autoplay = false;
                player.preload = "metadata";
                player.poster = imageSource;
                player.classList.add("notready");

                const source = document.createElement("source");
                source.src = videoSource;
                source.type = videoType;
                player.appendChild(source);

                player.addEventListener("click", () => {
                    if (player.paused && player.readyState > 1) {
                        player.play();
                        toggleFullScreen(player);
                        pauseOthers(player);
                    } else {
                        player.pause();
                    }
                    player.classList.toggle("notplaying", player.paused);
                });

                player.onplaying = () => {
                    lastPlayedVideo = player;
                };

                player.oncanplay = () => {
                    setTimeout(() => {
                        player.classList.remove("notready");
                        player.classList.add("notplaying");
                    }, 1000);
                };

                videoList.appendChild(player);
                videos.push(player);
            }

            const url = "https://script.google.com/macros/s/AKfycbx__TeLYl-rasvQ2msCnxNI7MpZB4BBp2Xmm-ZcTppgvRnrc4uQnCGWyUZlk5mppcD9/exec";

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(({ header: headerImg, profile: profileImg, name, currPage, lastPage, urls }) => {
                    header.style.backgroundImage = `url('${headerImg}')`;
                    profile.src = profileImg;
                    splitName(name);

                    urls.forEach(({ video_url, image_url }) => {
                        if (video_url && image_url) {
                            createVideoJs(video_url, image_url);
                        }
                    });

                    const currentPage = parseInt(currPage) || 0;
                    if (currentPage > 1) {
                        const prev = document.createElement("button");
                        prev.textContent = "Prev";
                        pager.appendChild(prev);
                    }
                    if (currentPage >= 1 && currentPage <= lastPage) {
                        const curr = document.createElement("button");
                        curr.classList.add("current");
                        curr.textContent = currPage;
                        pager.appendChild(curr);
                    }
                    if (currentPage < lastPage) {
                        const next = document.createElement("button");
                        next.textContent = "Next";
                        pager.appendChild(next);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    // You can handle the error here, e.g., display an error message to the user
                });

            document.addEventListener("fullscreenchange", () => {
                if (lastPlayedVideo) {
                    lastPlayedVideo.classList.toggle("fullScreen", document.fullscreenElement);
                    if (!document.fullscreenElement) {
                        setTimeout(() => {
                            const rect = lastPlayedVideo.getBoundingClientRect();
                            window.scrollTo({
                                top: rect.top + window.scrollY - rect.height,
                                left: rect.left + window.scrollX,
                                behavior: "smooth"
                            });
                        }, 500);
                    }
                }
            });
        });