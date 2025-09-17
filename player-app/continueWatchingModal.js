// continueWatchingModal.js
import { toggleFullscreen } from "./fullscreen_handler.js";

(function () {
  const MODAL_ID = "continueWatchingModal";
  const VIDEO_PROGRESS_KEY = "videoProgress";
  let videoElement = null;
  let videoId = null;
  let playerWrapper = null; // Add a variable to store the player wrapper

  /**
   * Creates and appends the continue watching modal to the body.
   */
  function createModal() {
    const modalHtml = `
            <div id="${MODAL_ID}" class="popup" style="display: none;">
                <div class="popup-header" style="justify-content: center;">
                    <h3>Continuar Viendo</h3>
                </div>
                <div class="popup-content" style="text-align: center;">
                    <p>Parece que dejaste de ver en <span id="lastWatchedTime"></span>.</p>
                    <p id="lastMinuteMessage" style="display: none; color: #f44336; font-weight: bold;">¡Estás en el último minuto del video!</p>
                    <button id="continueBtn" class="btn-primary" style="margin-bottom: 10px;">Continuar</button>
                    <button id="startOverBtn" class="btn-primary" style="background-color: #f44336;">Empezar de Nuevo</button>
                </div>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  /**
   * Shows the modal with the last watched time.
   * @param {number} timeInSeconds - The time in seconds to display.
   * @param {boolean} isLastMinute - True if the saved time is in the last minute of the video.
   */
  function showModal(timeInSeconds, isLastMinute) {
    const modal = document.getElementById(MODAL_ID);
    const lastWatchedTimeSpan = document.getElementById("lastWatchedTime");
    const lastMinuteMessage = document.getElementById("lastMinuteMessage");
    if (modal && lastWatchedTimeSpan && lastMinuteMessage) {
      lastWatchedTimeSpan.textContent = formatTime(timeInSeconds);
      if (isLastMinute) {
        lastMinuteMessage.style.display = "block";
      } else {
        lastMinuteMessage.style.display = "none";
      }
      modal.style.display = "flex";
    }
  }

  /**
   * Hides the modal.
   */
  function hideModal() {
    const modal = document.getElementById(MODAL_ID);
    if (modal) {
      modal.style.display = "none";
    }
  }

  /**
   * Saves the current video progress to local storage.
   */
  function saveVideoProgress() {
    if (videoElement && videoId) {
      const progress = {
        time: videoElement.currentTime,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        `${VIDEO_PROGRESS_KEY}_${videoId}`,
        JSON.stringify(progress)
      );
      console.log(
        `Video progress saved for ${videoId}: ${formatTime(progress.time)}`
      );
    }
  }

  /**
   * Retrieves the last saved video progress from local storage.
   * @returns {object|null} The progress object or null if not found.
   */
  function getSavedVideoProgress() {
    if (videoId) {
      const savedProgress = localStorage.getItem(
        `${VIDEO_PROGRESS_KEY}_${videoId}`
      );
      return savedProgress ? JSON.parse(savedProgress) : null;
    }
    return null;
  }

  /**
   * Formats time in seconds to HH:MM:SS string.
   * @param {number} seconds - The time in seconds.
   * @returns {string} Formatted time string.
   */
  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0 || h > 0) // Only show hours if present
      .join(":");
  }

  /**
   * Initializes the continue watching modal functionality.
   * @param {HTMLVideoElement} video - The video element to track.
   * @param {string} id - A unique ID for the video (e.g., its source URL or a custom ID).
   * @param {number} [initialTime=0] - Optional: An initial time to set the video to, overriding saved progress.
   */
  window.initContinueWatchingModal = function (video, id, initialTime = 0) {
    if (!video || !(video instanceof HTMLVideoElement)) {
      console.error(
        "Invalid video element provided to initContinueWatchingModal."
      );
      return;
    }
    if (!id) {
      console.error(
        "A unique video ID is required for initContinueWatchingModal."
      );
      return;
    }

    playerWrapper = document.getElementById("player-wrapper"); // Get the player wrapper element

    // Create modal if it doesn't exist
    if (!document.getElementById(MODAL_ID)) {
      createModal();
    }

    // Initially hide the modal
    hideModal();

    // Event listeners for modal buttons
    const continueBtn = document.getElementById("continueBtn");
    const startOverBtn = document.getElementById("startOverBtn");

    /**
     * Checks for saved video progress and shows the modal if applicable.
     * @param {number} [initialTime=0] - An optional initial time to set, overriding saved progress.
     */
    function checkAndShowProgress(initialTime = 0) {
      if (!videoElement) return;

      // Remove previous loadedmetadata listener to avoid multiple calls
      videoElement.removeEventListener("loadedmetadata", checkAndShowProgress);

      videoElement.addEventListener(
        "loadedmetadata",
        () => {
          let timeToSet = 0;
          if (initialTime > 0) {
            timeToSet = initialTime;
            console.log(
              `Using initialTime ${formatTime(
                initialTime
              )} for ${videoId}, overriding saved progress.`
            );
          } else {
            const savedProgress = getSavedVideoProgress();
            if (savedProgress && savedProgress.time > 1) {
              timeToSet = savedProgress.time;
            }
          }

          // If initialTime is provided and greater than 0, prioritize it and play directly
          if (initialTime > 0) {
            videoElement.currentTime = initialTime;
            videoElement.play(); // Auto-play when explicitly setting time
            document.getElementById("poster-bg").classList.add("hidden"); // Hide poster
            console.log(
              `Video for ${videoId} resumed at ${formatTime(
                initialTime
              )} due to explicit initialTime.`
            );
          } else if (timeToSet > 1) {
            // If there's saved progress and no initialTime, show the modal
            videoElement.pause(); // Ensure video is paused if modal is shown
            const isLastMinute =
              videoElement.duration && videoElement.duration - timeToSet <= 60;
            showModal(timeToSet, isLastMinute);
          } else {
            // If no significant progress and no initialTime, ensure video starts from beginning
            videoElement.currentTime = 0;
            videoElement.pause(); // Do not autoplay, let the user click play.
          }
        },
        { once: true }
      ); // Use { once: true } to ensure it only fires once per load

      // If video is already loaded, trigger the check immediately
      if (videoElement.readyState >= 2) {
        // HAVE_CURRENT_DATA or higher
        let timeToSet = 0;
        if (initialTime > 0) {
          timeToSet = initialTime;
          console.log(
            `Using initialTime ${formatTime(
              initialTime
            )} for ${videoId}, overriding saved progress.`
          );
        } else {
          const savedProgress = getSavedVideoProgress();
          if (savedProgress && savedProgress.time > 1) {
            timeToSet = savedProgress.time;
          }
        }

        // Apply the same logic for immediate check
        if (initialTime > 0) {
          videoElement.currentTime = initialTime;
          videoElement.play(); // Auto-play when explicitly setting time
          document.getElementById("poster-bg").classList.add("hidden"); // Hide poster
          console.log(
            `Video for ${videoId} resumed at ${formatTime(
              initialTime
            )} due to explicit initialTime (immediate check).`
          );
        } else if (timeToSet > 1) {
          videoElement.pause();
          const isLastMinute =
            videoElement.duration && videoElement.duration - timeToSet <= 60;
          showModal(timeToSet, isLastMinute);
        } else {
          videoElement.currentTime = 0;
          videoElement.pause();
        }
      }
    }

    /**
     * Updates the video element and ID, then checks for saved progress.
     * @param {HTMLVideoElement} newVideo - The new video element to track.
     * @param {string} newId - A unique ID for the new video.
     * @param {number} [initialTime=0] - Optional: An initial time to set the video to, overriding saved progress.
     */
    window.updateVideoSourceAndCheckProgress = function (
      newVideo,
      newId,
      initialTime = 0
    ) {
      if (!newVideo || !(newVideo instanceof HTMLVideoElement)) {
        console.error(
          "Invalid video element provided to updateVideoSourceAndCheckProgress."
        );
        return;
      }
      if (!newId) {
        console.error(
          "A unique video ID is required for updateVideoSourceAndCheckProgress."
        );
        return;
      }

      // Clear previous event listeners if videoElement changes
      if (videoElement && videoElement !== newVideo) {
        videoElement.removeEventListener("play", () => {
          clearInterval(saveInterval);
          saveInterval = setInterval(saveVideoProgress, 5000);
        });
        videoElement.removeEventListener("pause", () => {
          clearInterval(saveInterval);
          saveVideoProgress();
        });
        videoElement.removeEventListener("ended", () => {
          clearInterval(saveInterval);
          localStorage.removeItem(`${VIDEO_PROGRESS_KEY}_${videoId}`);
          console.log(`Video progress cleared for ${videoId} as video ended.`);
        });
        window.removeEventListener("beforeunload", saveVideoProgress);
      }

      videoElement = newVideo;
      videoId = newId;

      // Re-attach event listeners for saving progress to the new videoElement
      let saveInterval;
      videoElement.addEventListener("play", () => {
        saveInterval = setInterval(saveVideoProgress, 5000);
      });

      videoElement.addEventListener("pause", () => {
        clearInterval(saveInterval);
        saveVideoProgress(); // Save immediately on pause
      });

      videoElement.addEventListener("ended", () => {
        clearInterval(saveInterval);
        localStorage.removeItem(`${VIDEO_PROGRESS_KEY}_${videoId}`); // Clear progress on video end
        console.log(`Video progress cleared for ${videoId} as video ended.`);
      });

      // Save progress when the user navigates away or closes the tab
      window.addEventListener("beforeunload", saveVideoProgress);

      checkAndShowProgress(initialTime); // Trigger the check for the new video, passing initialTime
    };

    // Initial call to set up the video and check progress
    window.updateVideoSourceAndCheckProgress(video, id, initialTime);
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        const savedProgress = getSavedVideoProgress(); // Re-fetch in case it changed
        if (savedProgress) {
          videoElement.currentTime = savedProgress.time;
        }
        videoElement.play();
        document.getElementById("poster-bg").classList.add("hidden"); // Hide poster
        hideModal();
        // Request fullscreen when continuing the video
        if (playerWrapper) {
          toggleFullscreen(playerWrapper);
        } else {
          console.warn(
            "Player wrapper element not found. Fullscreen might not be triggered."
          );
        }
      });
    }

    if (startOverBtn) {
      startOverBtn.addEventListener("click", () => {
        videoElement.currentTime = 0;
        videoElement.play();
        document.getElementById("poster-bg").classList.add("hidden"); // Hide poster
        hideModal();
        // Request fullscreen when starting over the video
        if (playerWrapper) {
          toggleFullscreen(playerWrapper);
        } else {
          console.warn(
            "Player wrapper element not found. Fullscreen might not be triggered."
          );
        }
      });
    }

    // Save progress every 5 seconds while playing
    let saveInterval;
    videoElement.addEventListener("play", () => {
      saveInterval = setInterval(saveVideoProgress, 5000);
    });

    videoElement.addEventListener("pause", () => {
      clearInterval(saveInterval);
      saveVideoProgress(); // Save immediately on pause
    });

    videoElement.addEventListener("ended", () => {
      clearInterval(saveInterval);
      localStorage.removeItem(`${VIDEO_PROGRESS_KEY}_${videoId}`); // Clear progress on video end
      console.log(`Video progress cleared for ${videoId} as video ended.`);
    });

    // Save progress when the user navigates away or closes the tab
    window.addEventListener("beforeunload", saveVideoProgress);
  };
})();
