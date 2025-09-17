// Edita este objeto para cambiar el contenido que se carga por defecto.

import { buildPlayerHTML } from "./dom_builder.js";
import { toggleFullscreen } from "./fullscreen_handler.js"; // Import fullscreen toggle function

document.addEventListener("DOMContentLoaded", async () => {
  // Access the Google API Key from the global scope (defined in index.html)
  // IMPORTANT: Be aware of the security implications of exposing this key in client-side code.
  const GOOGLE_API_KEY = window.GOOGLE_API_KEY; 

  window.fullscreenRequestedThisSession = false; // Make it a global flag

  console.log("DOMContentLoaded event fired.");
  console.log("contentConfig:", window.contentConfig); // Debug: Check contentConfig

  // Inject the HTML content
  // Access contentConfig from the global scope (defined in index.html)
  document.body.innerHTML = buildPlayerHTML(contentConfig);

  console.log(
    "After innerHTML assignment. Checking report-form directly:",
    document.getElementById("report-form")
  ); // Debug: Check report-form immediately after injection

  // --- OBTENER ELEMENTOS DEL DOM ---
  // Moved after HTML injection to ensure elements are available
  const dom = {
    wrapper: document.getElementById("player-wrapper"),
    video: document.getElementById("video-element"),
    iframe: document.getElementById("iframe-element"),
    poster: document.getElementById("poster-bg"),
    animeLoaderAnimation: document.getElementById("anime-loader-animation"),
    controls: document.getElementById("controls-overlay"),
    centerPlayControls: document.querySelector(".center-play-controls"),
    playPauseBtn: document.getElementById("play-pause-btn"),
    timeline: document.getElementById("timeline"),
    currentTime: document.getElementById("current-time"),
    duration: document.getElementById("duration"),
    fullscreenBtn: document.getElementById("fullscreen-btn"),
    rewindBtn: document.getElementById("rewind-btn"),
    forwardBtn: document.getElementById("forward-btn"),
    backBtn: document.getElementById("back-btn"),
    prevEpisodeBtn: document.getElementById("prev-episode-btn"),
    nextEpisodeBtn: document.getElementById("next-episode-btn"),
    openLanguageModalBtn: document.getElementById("open-language-modal-btn"),
    openServerModalBtn: document.getElementById("open-server-modal-btn"), // New: Server modal button
    // Vertical menu elements
    verticalMenuContainer: document.getElementById("vertical-menu-container"),
    openLanguageModalBtnVertical: document.getElementById(
      "open-language-modal-btn-vertical"
    ),
    openServerModalBtnVertical: document.getElementById(
      "open-server-modal-btn-vertical"
    ), // New: Vertical server modal button
    timelineVertical: document.getElementById("timeline-vertical"),
    currentTimeVertical: document.getElementById("current-time-vertical"),
    durationVertical: document.getElementById("duration-vertical"),
    prevEpisodeBtnVertical: document.getElementById(
      "prev-episode-btn-vertical"
    ),
    nextEpisodeBtnVertical: document.getElementById(
      "next-episode-btn-vertical"
    ),
    downloadBtnVertical: document.getElementById("download-btn-vertical"),
    // Language Selection Modal elements
    languageSelectionModal: document.getElementById("language-selection-modal"),
    languageButtonsContainer: document.getElementById(
      "language-buttons-container"
    ),
    languageAcceptBtn: document.getElementById("language-accept-btn"),
    languageCancelBtn: document.getElementById("language-cancel-btn"),
    // Server Selection Modal elements
    serverSelectionModal: document.getElementById("server-selection-modal"), // New: Server selection modal
    serverButtonsContainer: document.getElementById("server-buttons-container"), // New: Server buttons container
    serverAcceptBtn: document.getElementById("server-accept-btn"), // New: Server modal accept button
    serverCancelBtn: document.getElementById("server-cancel-btn"), // New: Server modal cancel button
    popups: {
      episodes: document.getElementById("episodes-popup"),
      report: document.getElementById("report-popup"),
      downloadServers: document.getElementById("download-servers-popup"),
      reportConfirmation: document.getElementById("report-confirmation-modal"),
      languageSelection: document.getElementById("language-selection-modal"),
      serverSelection: document.getElementById("server-selection-modal"), // New: Server Selection Modal
    },
    reportConfirmationOkBtn: document.getElementById(
      "report-confirmation-ok-btn"
    ), // New: OK button for confirmation modal
    closePopupBtns: document.querySelectorAll(".close-popup-btn"), // Botones para cerrar popups
    title: document.getElementById("episode-title-display"),
    openExternalBtn: document.getElementById("open-external-btn"),
    downloadBtn: document.getElementById("download-btn"),
    bottomBar: document.querySelector(".bottom-bar"), // Add reference to bottom bar
    reportBtn: document.getElementById("report-btn"), // New: Report button
    skipButtonsContainer: document.getElementById("skip-buttons-container"), // New: Skip buttons container (horizontal)
    skipIntroBtn: document.getElementById("skip-intro-button"), // New: Skip intro button (horizontal)
    skipEndingBtn: document.getElementById("skip-ending-button"), // New: Skip ending button (horizontal)
    verticalSkipButtonsContainer: document.getElementById(
      "vertical-skip-buttons-container"
    ), // New: Vertical skip buttons container
    verticalSkipIntroBtn: document.getElementById("vertical-skip-intro-button"), // New: Vertical skip intro button
    verticalSkipEndingBtn: document.getElementById(
      "vertical-skip-ending-button"
    ), // New: Vertical skip ending button
    replayButton: document.getElementById("replay-button"), // New: Replay button
    // Report form elements
    reportForm: document.getElementById("report-form"),
    reportIssueType: document.getElementById("report-issue-type"), // New: Report issue type select
    reportDescription: document.getElementById("report-description"), // New: Report description textarea
    reportServerSelect: document.getElementById("report-server"),
    reportLanguageSelect: document.getElementById("report-language"),
    reportTypeStreaming: document.getElementById("report-type-streaming"),
    reportTypeDownload: document.getElementById("report-type-download"),
    reportChatId: document.getElementById("report-chat-id"),
    reportToken: document.getElementById("report-token"),
    reportTopic: document.getElementById("report-topic"),
    // Report form steps and navigation buttons
    reportStep1: document.getElementById("report-step-1"),
    reportStep2: document.getElementById("report-step-2"),
    reportNextBtn: document.getElementById("report-next-btn"),
    reportPrevBtn: document.getElementById("report-prev-btn"),
    // Download popup elements
    downloadServerSelect: document.getElementById("download-server-select"),
    startDownloadBtn: document.getElementById("start-download-btn"),
    downloadUnavailableMessage: document.getElementById(
      "download-unavailable-message"
    ), // New: Message for unavailable downloads
  };

  console.log("dom.popups.reportConfirmation:", dom.popups.reportConfirmation); // Debug: Check if element is found
  console.log("dom.reportConfirmationOkBtn:", dom.reportConfirmationOkBtn); // Debug: Check if element is found
  console.log("dom.reportForm:", dom.reportForm); // Debug line
  console.log("dom.reportServerSelect:", dom.reportServerSelect); // Debug line

  // Initialize currentLanguage with the first available language or default to "es"
  const availableLanguages = Object.keys(window.languageServers || {});
  let currentLanguage =
    availableLanguages.length > 0 ? availableLanguages[0] : "es";

  // Initialize currentServer with the first server of the current language
  let currentServer = null; // To keep track of the currently loaded server
  const initialServers = window.languageServers[currentLanguage];
  if (initialServers && initialServers.length > 0) {
    currentServer = initialServers[0];
  }

  // Import functions from external_handler.js
  const { showExternalPlayerModal, sendTelegramReport } = await import(
    "./external_handler.js"
  );

  // Initialize continue watching modal (will be re-initialized in loadSource)
  // This initial call is mainly to ensure the modal HTML is present if needed before loadSource runs.
  window.initContinueWatchingModal(
    dom.video,
    getContentKey(
      contentConfig,
      currentLanguage,
      currentServer ? currentServer.name : null
    )
  );
  // --- 1. CONFIGURACIÓN PRINCIPAL ---
  // --- ESTADO Y CONFIGURACIÓN ---
  let controlsTimeout;
  let selectedLanguageInModal; // To temporarily store the selected language in the modal
  let selectedServerInModal; // New: To temporarily store the selected server in the modal
  let playerInitialized = false; // New flag to track if player has been initialized
  let currentEpisodeTitle = ""; // Store the actual episode title
  let currentSeriesName = ""; // Store the series name
  let currentSeasonNumber = ""; // Store the season number
  let currentEpisodeNumber = ""; // Store the episode number
  let currentContentPosterUrl = ""; // Store the content poster URL
  let currentReportStep = 1; // New: Track current step of report form

  // --- FUNCIONES PRINCIPALES ---

  // Helper function to parse time strings (e.g., "2m", "1h30m") into seconds
  const parseTimeToSeconds = (timeString) => {
    if (typeof timeString === "number") {
      return timeString; // Already in seconds
    }
    if (typeof timeString !== "string") {
      return 0; // Invalid input
    }

    let totalSeconds = 0;
    const hoursMatch = timeString.match(/(\d+)h/);
    const minutesMatch = timeString.match(/(\d+)m/);
    const mmssMatch = timeString.match(/(\d+):(\d+)/); // New: MM:SS format

    if (hoursMatch) {
      totalSeconds += parseInt(hoursMatch[1]) * 3600;
    }
    if (minutesMatch) {
      totalSeconds += parseInt(minutesMatch[1]) * 60;
    } else if (mmssMatch) {
      // If MM:SS format, parse minutes and seconds
      totalSeconds += parseInt(mmssMatch[1]) * 60; // Minutes
      totalSeconds += parseInt(mmssMatch[2]); // Seconds
    }
    return totalSeconds;
  };

  // Helper function to get a direct playable link from a Google Drive shareable URL using the Drive API
  async function getGoogleDriveDirectLink(shareableUrl) {
    const regex = /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)(?:\/view)?(?:\?.*)?/;
    const match = shareableUrl.match(regex);
    if (match && match[1]) {
      const fileId = match[1];
      const apiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?key=${GOOGLE_API_KEY}&alt=media`;
      console.log("Constructed Google Drive API URL:", apiUrl); // Log the API URL

      try {
        const response = await fetch(apiUrl);
        console.log("Google Drive API response status:", response.status);
        console.log("Google Drive API response headers:", Array.from(response.headers.entries()));
        
        if (!response.ok) {
          // If the response is not OK, it might be due to permissions or invalid API key
          console.error("Error fetching Google Drive file:", response.status, response.statusText);
          // Attempt to parse error message from response body if available
          const errorData = await response.json().catch(() => null);
          if (errorData && errorData.error && errorData.error.message) {
            alert(`Error al cargar el video de Google Drive: ${errorData.error.message}. Asegúrate de que el archivo sea público y la API Key sea válida.`);
          } else {
            alert("Error al cargar el video de Google Drive. Asegúrate de que el archivo sea público y la API Key sea válida.");
          }
          return null; // Indicate failure
        }
        
        // The direct link is the response URL itself when alt=media is used
        const directUrl = response.url;
        console.log("Obtained direct Google Drive URL from response.url:", directUrl); // Log the direct URL
        
        // Check if the URL is actually a direct media link or a redirect
        // If it's a redirect to accounts.google.com, it means authentication is required or permissions are wrong.
        if (directUrl.includes("accounts.google.com")) {
          alert("El enlace de Google Drive requiere autenticación o los permisos del archivo no son correctos. Asegúrate de que el archivo sea público.");
          return null;
        }

        // Also check content type if possible, though response.url is usually the final step
        const contentType = response.headers.get("Content-Type");
        console.log("Content-Type of direct URL:", contentType);
        if (!contentType || !contentType.startsWith("video/")) {
          console.warn("The obtained URL does not seem to be a direct video link based on Content-Type:", contentType);
          // If it's not a video content type, it might be a download prompt or an HTML page.
          // In this case, we might need to try a different approach or inform the user.
          // For now, we'll proceed, but this is a potential point of failure.
        }

        return directUrl;
      } catch (error) {
        console.error("Network error or other issue fetching Google Drive file:", error);
        alert("Error de red al intentar cargar el video de Google Drive.");
        return null; // Indicate failure
      }
    }
    console.warn("Could not extract Google Drive file ID from URL:", shareableUrl);
    alert("URL de Google Drive no válida. Asegúrate de que sea un enlace de archivo compartible.");
    return null; // Return null if ID not found or invalid URL
  }

  function getContentKey(config, language, serverName) {
    // Use a combination of type, title, season, episode, language, and server name for a unique key
    const keyParts = [config.type, config.title || config.chapterName];
    if (config.season) keyParts.push(config.season);
    if (config.episode) keyParts.push(config.episode);
    if (language) keyParts.push(language);
    if (serverName) keyParts.push(serverName);
    return keyParts.join("-").replace(/[^a-zA-Z0-9-]/g, ""); // Sanitize for use as a key
  }

  async function fetchContentData() {
    console.log("Fetching content data...");

    let posterUrl = contentConfig.posterUrl || ""; // Use provided posterUrl if available
    currentEpisodeTitle =
      contentConfig.chapterName ||
      contentConfig.title ||
      "Título no disponible";
    dom.title.textContent = currentEpisodeTitle;

    // Set placeholder values for report form
    currentSeriesName = contentConfig.seriesName || "Contenido Personalizado";
    currentSeasonNumber = contentConfig.season || "N/A";
    currentEpisodeNumber = contentConfig.episode || "N/A";
    // Removed currentContentSynopsis = contentConfig.synopsis || "Sinopsis no disponible.";
    currentContentPosterUrl =
      contentConfig.reportPosterUrl || posterUrl || "N/A";

    console.log("Using custom content data.");
    return posterUrl; // Return the poster URL
  }

  // Helper para obtener el código de país y el nombre completo del idioma
  function getLanguageInfo(langCode) {
    const langInfoMap = {
      es: { country: "ES", name: "Español" },
      esmx: { country: "MX", name: "Español MX" }, // Added for esmx
      en: { country: "US", name: "English" },
      jp: { country: "JP", name: "Japonés" },
      mx: { country: "MX", name: "Mexicano" },
      // Añade más mapeos según sea necesario
    };
    const lowerLangCode = langCode.toLowerCase();

    if (langInfoMap[lowerLangCode]) {
      return langInfoMap[lowerLangCode];
    }

    // Fallback to Intl.DisplayNames for other languages
    try {
      const displayNames = new Intl.DisplayNames(["es"], { type: "language" });
      const languageName = displayNames.of(langCode);
      if (languageName) {
        return { country: langCode.toUpperCase(), name: languageName };
      }
    } catch (error) {
      console.warn("Intl.DisplayNames failed:", error);
    }

    // Final fallback to capitalized code
    return {
      country: langCode.toUpperCase(),
      name: lowerLangCode.charAt(0).toUpperCase() + lowerLangCode.slice(1),
    };
  }

  // Función para poblar las opciones de idioma en un select dado
  function populateLanguageSelect(selectElement) {
    selectElement.innerHTML = ""; // Clear existing options
    for (const langCode in window.languageServers) {
      const langInfo = getLanguageInfo(langCode);
      const option = document.createElement("option");
      option.value = langCode;
      option.textContent = langInfo.name;
      if (langCode === currentLanguage) {
        option.selected = true;
      }
      selectElement.appendChild(option);
    }
  }

  // Función para poblar las opciones de servidor para un idioma específico en un select dado
  function populateServersByLanguage(selectElement, langCode) {
    selectElement.innerHTML = ""; // Limpiar opciones existentes
    const servers = window.languageServers[langCode] || [];

    if (servers.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No hay servidores disponibles";
      option.disabled = true;
      selectElement.appendChild(option);
      selectElement.disabled = true;
      handleServerSelection(null); // No server selected
      return;
    }

    selectElement.disabled = false;
    servers.forEach((server) => {
      const option = document.createElement("option");
      option.value = server.url;
      option.textContent = server.name;
      option.dataset.mp4 = server.mp4; // Store mp4 type in dataset
      selectElement.appendChild(option);
    });

    let serverToSelect = null;
    // Try to keep the current server if it's in the new list
    if (currentServer && servers.some((s) => s.url === currentServer.url)) {
      serverToSelect = currentServer;
    } else {
      // Otherwise, select the first server in the new list
      serverToSelect = servers[0];
    }

    if (serverToSelect) {
      selectElement.value = serverToSelect.url;
      handleServerSelection(serverToSelect); // Load the selected server
    } else {
      // No servers available for this language
      handleServerSelection(null);
    }
  }

  // Manejador para la selección de idioma
  function handleLanguageSelection(langCode) {
    console.log("handleLanguageSelection called with:", langCode);
    currentLanguage = langCode;
    // Update the text in the server selection buttons
    updateServerSelectText();

    const serversForNewLang = window.languageServers[currentLanguage];
    let serverToLoad = null;

    if (serversForNewLang && serversForNewLang.length > 0) {
      // Try to find the currently playing server in the new language list
      const foundServer = serversForNewLang.find(
        (s) => currentServer && s.url === currentServer.url
      );

      if (foundServer) {
        serverToLoad = foundServer;
      } else {
        // If current server not found in new language, default to the first server of the new language
        serverToLoad = serversForNewLang[0];
      }
    } else {
      // No servers available for this language
      serverToLoad = null;
    }

    // Update currentServer and load source
    handleServerSelection(serverToLoad);
  }

  // Manejador para la selección de servidor
  function handleServerSelection(server) {
    console.log("handleServerSelection called with:", server);
    const currentTimeBeforeChange = dom.video.currentTime; // Capture current time
    currentServer = server; // Update currentServer
    updateServerSelectText(); // Update the text in the server selection buttons
    if (server) {
      loadSource(server, currentTimeBeforeChange); // Pass current time
    } else {
      // Handle case where no server is available or selected
      stopPlayback(); // Stop any ongoing playback
    }
  }

  let hls; // Declare hls variable globally within the script scope

  function loadSource(server, startTime = 0) {
    // Accept startTime, default to 0
    console.log("Loading source:", server.name, "with startTime:", startTime);
    dom.poster.classList.remove("hidden"); // Always show poster when loading new source

    const urlToLoad = server.url; // Use direct URL
    console.log("URL to load:", urlToLoad);

    // Always set the play button to "play_arrow" when a new source is loaded
    dom.playPauseBtn.textContent = "play_arrow";
    dom.playPauseBtn.classList.remove("hidden"); // Ensure play button is visible
    dom.replayButton.classList.add("hidden"); // Ensure replay button is hidden

    // Clear any existing HLS.js instance
    if (hls) {
      hls.destroy();
      console.log("Previous HLS.js instance destroyed.");
    }

    // Reset video and iframe sources
    dom.video.src = "";
    dom.iframe.src = "about:blank";

    // Hide iframe and show video by default for MP4/HLS
    dom.iframe.classList.add("hidden");
    dom.video.classList.remove("hidden");
    dom.timeline.classList.remove("hidden");
    dom.fullscreenBtn.classList.remove("hidden");
    dom.centerPlayControls.classList.remove("hidden");
    dom.timelineVertical.classList.remove("hidden");
    dom.currentTimeVertical.classList.remove("hidden");
    dom.durationVertical.classList.remove("hidden");
    dom.wrapper.classList.remove("iframe-active");
    dom.bottomBar.classList.remove("hidden"); // Ensure bottom bar is visible initially

    if (server.mp4) {
      console.log("Loading MP4 source.");
      dom.video.src = urlToLoad;
      dom.video.load(); // Explicitly load the video
      dom.animeLoaderAnimation.classList.remove("hidden"); // Show loader
      dom.video.classList.remove("object-fit-cover"); // Ensure it starts with contain

      if (startTime > 0) {
        dom.video.currentTime = startTime;
        console.log("Set video currentTime to:", startTime);
      }
      dom.video.play().catch((error) => {
        console.error("Autoplay prevented for MP4:", error);
        dom.playPauseBtn.textContent = "play_arrow";
        dom.playPauseBtn.classList.remove("hidden");
        dom.poster.classList.remove("hidden");
      });
    } else if (server.hls && Hls.isSupported()) {
      console.log("Loading HLS (M3U8) source.");
      hls = new Hls();
      hls.loadSource(urlToLoad);
      hls.attachMedia(dom.video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        console.log("HLS manifest parsed.");
        dom.animeLoaderAnimation.classList.add("hidden"); // Hide loader
        dom.video.classList.remove("hidden"); // Show video
        if (startTime > 0) {
          dom.video.currentTime = startTime;
          console.log("Set video currentTime to:", startTime);
        }
        dom.video.play().catch((error) => {
          console.error("Autoplay prevented for HLS:", error);
          dom.playPauseBtn.textContent = "play_arrow";
          dom.playPauseBtn.classList.remove("hidden");
          dom.poster.classList.remove("hidden");
        });
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        console.error("HLS.js error:", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Fatal network error encountered, trying to recover...");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Fatal media error encountered, trying to recover...");
              hls.recoverMediaError();
              break;
            default:
              // Cannot recover
              hls.destroy();
              dom.poster.classList.remove("hidden");
              dom.animeLoaderAnimation.classList.add("hidden");
              dom.title.textContent = "Error al cargar el video HLS. Intenta con otro servidor.";
              break;
          }
        }
      });
      dom.animeLoaderAnimation.classList.remove("hidden"); // Show loader for HLS
      dom.video.classList.remove("object-fit-cover"); // Ensure it starts with contain
    } else if (server.hls && !Hls.isSupported()) {
      console.error("HLS is not supported in this browser.");
      dom.poster.classList.remove("hidden");
      dom.animeLoaderAnimation.classList.add("hidden");
      dom.title.textContent = "Tu navegador no soporta la reproducción de este tipo de video (HLS).";
    } else if (server.gdrive) {
      console.log("Loading Google Drive source.");
      dom.animeLoaderAnimation.classList.remove("hidden"); // Show loader for GDrive
      getGoogleDriveDirectLink(urlToLoad).then((directUrl) => {
        if (directUrl) {
          dom.video.src = directUrl;
          dom.video.load();
          dom.video.classList.remove("object-fit-cover");

          if (startTime > 0) {
            dom.video.currentTime = startTime;
            console.log("Set video currentTime to:", startTime);
          }
          dom.video.play().catch((error) => {
            console.error("Autoplay prevented for Google Drive:", error);
            dom.playPauseBtn.textContent = "play_arrow";
            dom.playPauseBtn.classList.remove("hidden");
            dom.poster.classList.remove("hidden");
          });
        } else {
          // Handle case where direct URL could not be obtained
          dom.poster.classList.remove("hidden");
          dom.animeLoaderAnimation.classList.add("hidden");
          dom.title.textContent = "Error al cargar el video de Google Drive. Intenta con otro servidor o verifica la API Key.";
        }
      }).catch((error) => {
        console.error("Error processing Google Drive link:", error);
        dom.poster.classList.remove("hidden");
        dom.animeLoaderAnimation.classList.add("hidden");
        dom.title.textContent = "Error al procesar el enlace de Google Drive.";
      });
    } else if (server.yandex) {
      console.log("Loading Yandex Disk source. Original URL:", urlToLoad);
      dom.animeLoaderAnimation.classList.remove("hidden"); // Show loader for Yandex

      // The public_key parameter for Yandex API expects the full shareable URL
      const yandexApiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(urlToLoad)}`;
      console.log("Constructed Yandex Disk API URL:", yandexApiUrl);

      // Fetch the direct URL to ensure it's a playable video link
      fetch(yandexApiUrl)
        .then(response => {
          console.log("Yandex API response status:", response.status);
          console.log("Yandex API response headers:", Array.from(response.headers.entries()));
          if (!response.ok) {
            throw new Error(`Yandex API error: ${response.status} ${response.statusText}`);
          }
          return response.json(); // Parse JSON to get the actual direct URL
        })
        .then(data => {
          const finalVideoUrl = data.href; // Use data.href as per user feedback
          console.log("Final Yandex video URL from API (data.href):", finalVideoUrl);

          if (finalVideoUrl) {
            // Prepend a CORS proxy to the final video URL for Yandex Disk
            // IMPORTANT: Replace 'YOUR_CORS_PROXY_URL_HERE' with an actual CORS proxy.
            // For example, 'https://corsproxy.io/?' or a self-hosted proxy.
            const corsProxy = 'https://corsproxy.io/?'; // Using a public proxy for demonstration
            const proxiedVideoUrl = corsProxy + encodeURIComponent(finalVideoUrl);
            console.log("Proxied Yandex video URL:", proxiedVideoUrl);

            if (Hls.isSupported()) {
              console.log("Attempting to load Yandex video with HLS.js.");
              hls = new Hls();
              hls.loadSource(proxiedVideoUrl); // Use the proxied URL
              hls.attachMedia(dom.video);
              hls.on(Hls.Events.MANIFEST_PARSED, function () {
                console.log("HLS manifest parsed for Yandex video.");
                dom.animeLoaderAnimation.classList.add("hidden"); // Hide loader
                dom.video.classList.remove("hidden"); // Show video
                if (startTime > 0) {
                  dom.video.currentTime = startTime;
                  console.log("Set video currentTime to:", startTime);
                }
                dom.video.play().catch((error) => {
                  console.error("Autoplay prevented for Yandex Disk (HLS.js):", error);
                  dom.playPauseBtn.textContent = "play_arrow";
                  dom.playPauseBtn.classList.remove("hidden");
                  dom.poster.classList.remove("hidden");
                });
              });
              hls.on(Hls.Events.ERROR, function (event, data) {
                console.error("HLS.js error for Yandex video:", data);
                if (data.fatal) {
                  switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                      console.error("Fatal network error encountered for Yandex video, trying to recover...");
                      hls.startLoad();
                      break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                      console.error("Fatal media error encountered for Yandex video, trying to recover...");
                      hls.recoverMediaError();
                      break;
                    default:
                      // Cannot recover
                      hls.destroy();
                      dom.poster.classList.remove("hidden");
                      dom.animeLoaderAnimation.classList.add("hidden");
                      dom.title.textContent = "Error al cargar el video de Yandex Disk con HLS.js. Intenta con otro servidor.";
                      break;
                  }
                }
              });
              dom.animeLoaderAnimation.classList.remove("hidden"); // Show loader for Yandex
              dom.video.classList.remove("object-fit-cover"); // Ensure it starts with contain
            } else {
              console.error("HLS.js is not supported in this browser, cannot play Yandex video directly.");
              dom.poster.classList.remove("hidden");
              dom.animeLoaderAnimation.classList.add("hidden");
              dom.title.textContent = "Tu navegador no soporta la reproducción de este tipo de video (Yandex/HLS).";
            }
          } else {
            console.error("Yandex API did not return a direct video URL (data.href is missing).");
            dom.poster.classList.remove("hidden");
            dom.animeLoaderAnimation.classList.add("hidden");
            dom.title.textContent = "Error: No se pudo obtener el enlace directo de Yandex. Asegúrate de que el archivo sea público y el enlace sea válido.";
          }
        })
        .catch((error) => {
          console.error("Error fetching Yandex direct link:", error);
          dom.poster.classList.remove("hidden");
          dom.animeLoaderAnimation.classList.add("hidden");
            dom.title.textContent = `Error al cargar el video de Yandex Disk: ${error.message}. Intenta con otro servidor o verifica el enlace.`;
        });
    } else if (server.mkv) {
      console.log("Loading MKV source.");
      dom.video.src = urlToLoad;
      dom.video.load(); // Explicitly load the video
      dom.animeLoaderAnimation.classList.remove("hidden"); // Show loader
      dom.video.classList.remove("object-fit-cover"); // Ensure it starts with contain

      if (startTime > 0) {
        dom.video.currentTime = startTime;
        console.log("Set video currentTime to:", startTime);
      }
      dom.video.play().catch((error) => {
        console.error("Autoplay prevented for MKV:", error);
        dom.playPauseBtn.textContent = "play_arrow";
        dom.playPauseBtn.classList.remove("hidden");
        dom.poster.classList.remove("hidden");
      });
    } else {
      // Default to iframe for unknown server types or if direct video playback is not intended
      console.log("Loading Iframe source.");
      dom.iframe.src = urlToLoad;
      dom.iframe.classList.remove("hidden");
      dom.video.classList.add("hidden");
      dom.timeline.classList.add("hidden");
      dom.centerPlayControls.classList.add("hidden");
      dom.timelineVertical.classList.add("hidden");
      dom.currentTimeVertical.classList.add("hidden");
      dom.durationVertical.classList.add("hidden");
      dom.wrapper.classList.add("iframe-active");
      dom.bottomBar.classList.remove("hidden"); // Ensure bottom bar is visible for iframes
      dom.animeLoaderAnimation.classList.add("hidden"); // Hide loader for iframes
      dom.poster.classList.add("hidden"); // Hide poster for iframes
    }
    currentServer = server; // Store the currently loaded server
    dom.controls.classList.add("hidden"); // Hide controls initially when loading new source
    dom.bottomBar.classList.add("hidden"); // Hide bottom bar initially when loading new source
    clearTimeout(controlsTimeout); // Clear any existing timeout

    // Re-initialize continue watching modal with the new server/language context
    window.initContinueWatchingModal(
      dom.video,
      getContentKey(
        contentConfig,
        currentLanguage,
        currentServer ? currentServer.name : null
      ),
      startTime // Pass startTime to the modal initializer
    );
  }

  // Function to manage skip intro and skip ending button visibility
  function updateSkipButtonsVisibility() {
    // If the video has ended, ensure horizontal skip buttons are hidden
    if (dom.video.ended) {
      dom.skipIntroBtn.classList.add("hidden");
      dom.skipEndingBtn.classList.add("hidden");
      dom.skipButtonsContainer.classList.remove("active");
      dom.verticalSkipIntroBtn.classList.add("hidden");
      dom.verticalSkipEndingBtn.classList.add("hidden");
      return;
    }

    const { introStartTime, introEndTime, endingStartTime } =
      window.contentConfig;
    const introStartTimeInSeconds = parseTimeToSeconds(introStartTime);
    const introEndTimeInSeconds = parseTimeToSeconds(introEndTime);

    // Calculate endingStartTimeInSeconds, defaulting to Infinity if not provided or invalid
    const endingStartTimeInSeconds =
      endingStartTime !== undefined &&
      endingStartTime !== null &&
      endingStartTime !== ""
        ? parseTimeToSeconds(endingStartTime)
        : Infinity;

    const isMp4 = currentServer && currentServer.mp4;
    const currentTime = dom.video.currentTime;
    const duration = dom.video.duration;

    // Ending always ends at the video's duration
    const endingEndTimeInSeconds = duration;

    console.log(
      "updateSkipButtonsVisibility:",
      "introStartTime:",
      introStartTime,
      "introEndTime:",
      introEndTime,
      "endingStartTime:",
      endingStartTime,
      "calculatedEndingEndTime:",
      endingEndTimeInSeconds,
      "currentTime:",
      currentTime,
      "duration:",
      duration
    );

    // Reset visibility for horizontal buttons and their container
    dom.skipIntroBtn.classList.add("hidden");
    dom.skipEndingBtn.classList.add("hidden");
    dom.skipButtonsContainer.classList.add("hidden"); // Ensure container is hidden by default

    // Vertical skip buttons should always be visible if in portrait mode
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    let showVerticalSkipContainer = false;
    let showHorizontalSkipContainer = false;

    if (isPortrait) { // Removed isMp4 check
      // Logic for Vertical Skip Intro button
      if (
        introStartTimeInSeconds !== undefined &&
        introEndTimeInSeconds !== undefined &&
        currentTime >= introStartTimeInSeconds &&
        currentTime < introEndTimeInSeconds
      ) {
        dom.verticalSkipIntroBtn.classList.remove("hidden");
        showVerticalSkipContainer = true;
      } else {
        dom.verticalSkipIntroBtn.classList.add("hidden");
      }

      // Logic for Vertical Skip Ending button
      if (
        endingStartTimeInSeconds !== undefined &&
        duration && // Ensure duration is available
        endingStartTimeInSeconds < duration && // Ensure endingStartTime is actually within the video's bounds
        currentTime >= endingStartTimeInSeconds &&
        currentTime < duration - 1 // Show until 1 second before the end
      ) {
        dom.verticalSkipEndingBtn.classList.remove("hidden");
        showVerticalSkipContainer = true;
      } else {
        dom.verticalSkipEndingBtn.classList.add("hidden");
      }

      if (showVerticalSkipContainer) {
        dom.verticalSkipButtonsContainer.classList.remove("hidden");
      } else {
        dom.verticalSkipButtonsContainer.classList.add("hidden");
      }
    } else {
      // If not in portrait mode, ensure vertical buttons and container are hidden
      dom.verticalSkipIntroBtn.classList.add("hidden");
      dom.verticalSkipEndingBtn.classList.add("hidden");
      dom.verticalSkipButtonsContainer.classList.add("hidden");
    }

    // Logic for Horizontal Skip Intro/Ending buttons (only if not in portrait mode)
    if (!isPortrait) { // Removed isMp4 check
      if (
        introStartTimeInSeconds !== undefined &&
        introEndTimeInSeconds !== undefined &&
        currentTime >= introStartTimeInSeconds &&
        currentTime < introEndTimeInSeconds
      ) {
        dom.skipIntroBtn.classList.remove("hidden");
        showHorizontalSkipContainer = true;
      }

      if (
        endingStartTimeInSeconds !== undefined &&
        duration &&
        endingStartTimeInSeconds < duration &&
        currentTime >= endingStartTimeInSeconds &&
        currentTime < duration - 1 // Show until 1 second before the end
      ) {
        dom.skipEndingBtn.classList.remove("hidden");
        showHorizontalSkipContainer = true;
      }

      if (showHorizontalSkipContainer) {
        dom.skipButtonsContainer.classList.remove("hidden");
      } else {
        dom.skipButtonsContainer.classList.add("hidden");
      }
    }
  }

  // Event listener for the skip intro button
  dom.skipIntroBtn.addEventListener("click", () => {
    const introEndTimeValue = window.contentConfig.introEndTime;
    if (introEndTimeValue !== undefined) {
      const introEndTimeInSeconds = parseTimeToSeconds(introEndTimeValue);
      console.log(
        "Skip intro button clicked. Attempting to skip to:",
        introEndTimeInSeconds,
        "Current video time:",
        dom.video.currentTime
      );
      dom.video.currentTime = introEndTimeInSeconds;
      dom.skipButtonsContainer.classList.remove("active"); // Hide container after skipping
    }
  });

  // Event listener for the skip ending button
  dom.skipEndingBtn.addEventListener("click", () => {
    dom.skipEndingBtn.classList.add("hidden"); // Hide button immediately
    dom.skipButtonsContainer.classList.remove("active"); // Hide container immediately
    if (dom.video.duration) {
      dom.video.currentTime = dom.video.duration; // Set to the end of the video
    }
    handleVideoEnd();
  });

  // Event listener for the vertical skip intro button
  dom.verticalSkipIntroBtn.addEventListener("click", () => {
    const introEndTimeValue = window.contentConfig.introEndTime;
    if (introEndTimeValue !== undefined) {
      const introEndTimeInSeconds = parseTimeToSeconds(introEndTimeValue);
      console.log(
        "Vertical skip intro button clicked. Attempting to skip to:",
        introEndTimeInSeconds,
        "Current video time:",
        dom.video.currentTime
      );
      dom.video.currentTime = introEndTimeInSeconds;
      // Do not hide verticalSkipButtonsContainer after skipping
    }
  });

  // Event listener for the vertical skip ending button
  dom.verticalSkipEndingBtn.addEventListener("click", () => {
    dom.verticalSkipEndingBtn.classList.add("hidden"); // Hide button immediately
    if (dom.video.duration) {
      dom.video.currentTime = dom.video.duration; // Set to the end of the video
    }
    handleVideoEnd();
  });

  // Function to handle the end of the video (either by finishing or skipping)
  async function handleVideoEnd() {
    console.log("Video end handled.");
    localStorage.removeItem(
      getContentKey(
        contentConfig,
        currentLanguage,
        currentServer ? currentServer.name : null
      )
    );
    dom.video.pause();
    // Removed: dom.video.classList.add("hidden"); // Ensure video element is hidden
    // Removed: dom.iframe.classList.add("hidden"); // Ensure iframe is hidden
    dom.iframe.src = "about:blank"; // Clear iframe src
    // When video ends (or skip ending is pressed), the poster should remain hidden.
    // The replay button will be shown, allowing the user to restart playback.
    // The video element itself should remain visible, but paused at the end.
    dom.replayButton.classList.remove("hidden");
    dom.playPauseBtn.classList.add("hidden");
    dom.controls.classList.remove("hidden");
    dom.bottomBar.classList.remove("hidden");
    dom.verticalMenuContainer.classList.add("active");

    // Hide all skip buttons and their containers
    dom.skipIntroBtn.classList.add("hidden");
    dom.skipEndingBtn.classList.add("hidden");
    dom.skipButtonsContainer.classList.remove("active");
    dom.verticalSkipIntroBtn.classList.add("hidden");
    dom.verticalSkipEndingBtn.classList.add("hidden");
  }

  window.changeEpisode = (newEpisode) => {
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set("e", newEpisode);
    window.location.href = currentUrl.href;
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "00:00";
    const totalSeconds = Math.floor(timeInSeconds);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    } else {
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    }
  };

  function isInteractiveControl(element) {
    if (!element) return false;
    return (
      element.closest("button") ||
      element.closest("input") ||
      element.closest("select") ||
      element.closest("textarea") ||
      element.closest("#timeline") ||
      element.closest("#timeline-vertical")
    );
  }

  const hideControls = () => {
    // Check if any popup is currently visible OR if a select element has focus
    const anyPopupOpen = Object.values(dom.popups).some(
      (popup) => !popup.classList.contains("hidden")
    );
    const selectHasFocus =
      document.activeElement === dom.downloadServerSelect ||
      document.activeElement === dom.reportServerSelect ||
      document.activeElement === dom.reportLanguageSelect;

    if (anyPopupOpen || selectHasFocus) {
      // If a popup is open, or a select has focus, don't hide controls
      return;
    }

    // If iframe is active, controls should always be visible, so do not hide them.
    if (dom.wrapper.classList.contains("iframe-active")) {
      clearTimeout(controlsTimeout); // Ensure no timeout is active to hide controls
      return;
    }

    // Disable pointer events to prevent accidental mouseover re-triggering showControls
    dom.controls.style.pointerEvents = "none";
    dom.bottomBar.style.pointerEvents = "none";
    dom.verticalMenuContainer.style.pointerEvents = "none";

    dom.controls.classList.add("hidden");
    dom.bottomBar.classList.add("hidden"); // Hide bottom bar
    dom.verticalMenuContainer.classList.remove("active"); // Hide vertical menu

    // Always hide the skip buttons container when controls are hidden.
    // Its visibility will be re-evaluated by updateSkipButtonsVisibility when controls are shown.
    dom.skipButtonsContainer.classList.remove("active");
    // The vertical skip buttons container should not be hidden by hideControls
  };

  const showControls = () => {
    // Re-enable pointer events
    dom.controls.style.pointerEvents = "auto";
    dom.bottomBar.style.pointerEvents = "auto";
    dom.verticalMenuContainer.style.pointerEvents = "auto";

    dom.controls.classList.remove("hidden");
    dom.bottomBar.classList.remove("hidden"); // Show bottom bar
    dom.verticalMenuContainer.classList.add("active"); // Show vertical menu

    clearTimeout(controlsTimeout);
    if (!dom.video.paused) {
      controlsTimeout = setTimeout(hideControls, 3000);
    }
    updateSkipButtonsVisibility(); // Re-evaluate visibility of skip buttons
  };
  const hideAllPopups = () => {
    dom.popups.episodes.classList.add("hidden");
    dom.popups.report.classList.add("hidden"); // Hide report popup
    dom.popups.downloadServers.classList.add("hidden"); // Hide download servers popup
    dom.popups.reportConfirmation.classList.add("hidden"); // Hide report confirmation modal
    dom.popups.languageSelection.classList.add("hidden"); // Hide language selection modal
    dom.popups.serverSelection.classList.add("hidden"); // Hide server selection modal
  };

  // Function to populate language buttons in the modal
  function populateLanguageButtons() {
    dom.languageButtonsContainer.innerHTML = ""; // Clear existing buttons
    let currentSelectedButton = null; // Keep track of the currently selected button element

    for (const langCode in window.languageServers) {
      const langInfo = getLanguageInfo(langCode);
      const button = document.createElement("button");
      button.classList.add("language-button");
      if (langCode === selectedLanguageInModal) {
        button.classList.add("selected");
        currentSelectedButton = button; // Set this as the initially selected button
      }
      button.dataset.langCode = langCode;
      button.innerHTML = `
        <div class="language-info">
          <img src="https://flagsapi.com/${
            langInfo.country
          }/flat/32.png" alt="${langInfo.name} Flag" class="flag-icon">
          <span class="language-name-text">${langInfo.name}</span>
        </div>
        <span class="material-icons checkmark-icon ${
          langCode === selectedLanguageInModal ? "" : "hidden"
        }">check</span>
      `;
      button.addEventListener("click", () => {
        // If there was a previously selected button, remove its selected state and hide its checkmark
        if (currentSelectedButton) {
          currentSelectedButton.classList.remove("selected");
          const prevCheckmark =
            currentSelectedButton.querySelector(".checkmark-icon");
          if (prevCheckmark) prevCheckmark.classList.add("hidden");
        }

        // Add 'selected' class to the clicked button and show its checkmark
        button.classList.add("selected");
        const newCheckmark = button.querySelector(".checkmark-icon");
        if (newCheckmark) newCheckmark.classList.remove("hidden");

        // Update the temporarily selected language
        selectedLanguageInModal = langCode;
        // Update the reference to the current selected button
        currentSelectedButton = button;
      });
      dom.languageButtonsContainer.appendChild(button);
    }
  }

  // Event listener for the language modal's accept button
  if (dom.languageAcceptBtn) {
    dom.languageAcceptBtn.addEventListener("click", () => {
      if (selectedLanguageInModal) {
        handleLanguageSelection(selectedLanguageInModal);
      }
      hideAllPopups(); // Close modal after accepting
    });
  }

  // Event listener for the language modal's cancel button
  if (dom.languageCancelBtn) {
    dom.languageCancelBtn.addEventListener("click", () => {
      hideAllPopups(); // Close modal on cancel
    });
  }

  // Function to populate server buttons in the modal
  function populateServerButtons() {
    dom.serverButtonsContainer.innerHTML = ""; // Clear existing buttons
    let currentSelectedServerButton = null;

    const servers = window.languageServers[currentLanguage] || [];

    if (servers.length === 0) {
      dom.serverButtonsContainer.innerHTML = `<p class="no-servers-message">No hay servidores disponibles para este idioma.</p>`;
      return;
    }

    console.log("populateServerButtons: currentServer =", currentServer);
    console.log(
      "populateServerButtons: selectedServerInModal =",
      selectedServerInModal
    );

    servers.forEach((server) => {
      const button = document.createElement("button");
      button.classList.add("server-button");
      // Determine if this server is the currently active one
      const isInitiallySelected = selectedServerInModal === server;

      if (isInitiallySelected) {
        button.classList.add("selected");
        currentSelectedServerButton = button;
        console.log(`Server ${server.name} is initially selected in modal.`);
      }
      button.dataset.serverUrl = server.url;
      button.dataset.serverName = server.name;
      button.dataset.serverMp4 = server.mp4;
      button.dataset.serverHls = server.hls; // Add hls dataset
      button.dataset.serverYandex = server.yandex; // Add yandex dataset
      button.dataset.serverMkv = server.mkv; // Add mkv dataset
      let serverIcon = "dvr"; // Default icon for generic server
      let serverTag = "";

      // Check if it's an iframe server (assuming iframe servers don't have mp4, hls, yandex, mkv, gdrive flags)
      const isIframeServer = !(server.mp4 || server.hls || server.yandex || server.mkv || server.gdrive);

      if (!isIframeServer) {
        // For all non-iframe servers, display the "MP4" tag
        serverTag = '<span class="server-mp4-tag">MP4</span>';
        // Set a generic video icon for non-iframe types
        serverIcon = "movie";
      } else {
        // For iframe servers, use a specific icon and no tag
        serverIcon = "web_asset"; // Icon for iframe/web content
        serverTag = ""; // No tag for iframe
      }
      button.innerHTML = `
        <div class="server-info">
          <span class="material-icons">${serverIcon}</span>
          <span class="server-name-text">${server.name}</span>
          ${serverTag}
        </div>
        <span class="material-icons checkmark-icon ${
          isInitiallySelected ? "" : "hidden"
        }">check</span>
      `;
      button.addEventListener("click", () => {
        // Remove 'selected' class and hide checkmark from the previously selected button
        if (currentSelectedServerButton) {
          currentSelectedServerButton.classList.remove("selected");
          const prevCheckmark =
            currentSelectedServerButton.querySelector(".checkmark-icon");
          if (prevCheckmark) prevCheckmark.classList.add("hidden");
        }

        // Add 'selected' class and show checkmark to the newly clicked button
        button.classList.add("selected");
        const newCheckmark = button.querySelector(".checkmark-icon");
        if (newCheckmark) newCheckmark.classList.remove("hidden");

        // Update the temporarily selected server in the modal by reference
        selectedServerInModal = server;
        // Update the reference to the current selected button
        currentSelectedServerButton = button;
        console.log("Server selected in modal:", selectedServerInModal);
      });
      dom.serverButtonsContainer.appendChild(button);
    });
  }

  // Event listener for the server modal's accept button
  if (dom.serverAcceptBtn) {
    dom.serverAcceptBtn.addEventListener("click", () => {
      if (selectedServerInModal) {
        handleServerSelection(selectedServerInModal);
      }
      hideAllPopups(); // Close modal after accepting
    });
  }

  // Event listener for the server modal's cancel button
  if (dom.serverCancelBtn) {
    dom.serverCancelBtn.addEventListener("click", () => {
      hideAllPopups(); // Close modal on cancel
    });
  }

  // Function to update the text in the server selection buttons
  function updateServerSelectText() {
    const serverText = currentServer ? currentServer.name : "Servidor";
    if (dom.openServerModalBtn) {
      dom.openServerModalBtn.querySelector(".server-select-text").textContent =
        serverText;
    }
    if (dom.openServerModalBtnVertical) {
      dom.openServerModalBtnVertical.querySelector(
        ".server-select-text"
      ).textContent = serverText;
    }
  }

  // Function to populate download servers dropdown
  function populateDownloadServersDropdown() {
    dom.downloadServerSelect.innerHTML = ""; // Clear existing options
    const servers = window.downloadServers[currentLanguage] || [];

    if (servers.length === 0) {
      dom.downloadServerSelect.classList.add("hidden"); // Hide server select
      dom.startDownloadBtn.classList.add("hidden"); // Hide start download button
      dom.downloadUnavailableMessage.classList.remove("hidden"); // Show unavailable message
      dom.downloadUnavailableMessage.innerHTML = `
        <div class="download-unavailable-content">
          <img src="https://image.myanimelist.net/ui/BQM6jEZ-UJLgGUuvrNkYUCG8p-X1WhZLiR4h-oxkqQdqHrJHiKZ4KaGQOmlUpp95VkOtHSiFmpA9dELbOu_ZUw" alt="Pronto disponible" class="download-unavailable-gif">
          <p>Pronto disponible para su descarga</p>
        </div>
      `;
      return;
    }

    dom.downloadServerSelect.classList.remove("hidden"); // Show server select
    dom.startDownloadBtn.classList.remove("hidden"); // Show start download button
    dom.downloadUnavailableMessage.classList.add("hidden"); // Hide unavailable message

    dom.downloadServerSelect.innerHTML = ""; // Clear existing options
    servers.forEach((server) => {
      const option = document.createElement("option");
      option.value = server.url;
      option.textContent = server.name;
      option.dataset.type = server.type; // Store download type in dataset
      dom.downloadServerSelect.appendChild(option);
    });
  }

  // Handler for initiating download
  function handleDownloadInitiation() {
    const selectedOption =
      dom.downloadServerSelect.options[dom.downloadServerSelect.selectedIndex];
    if (!selectedOption || !selectedOption.value) {
      alert("Por favor, selecciona un servidor de descarga.");
      return;
    }

    const serverUrl = selectedOption.value;
    const serverType = selectedOption.dataset.type;
    const serverName = selectedOption.textContent;

    hideAllPopups();

    if (serverType === "mp4") {
      const a = document.createElement("a");
      a.href = serverUrl;
      a.download = `${serverName}-${
        contentConfig.title || contentConfig.chapterName || "video"
      }-${contentConfig.season || ""}-${contentConfig.episode || ""}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(serverUrl, "_blank");
    }
  }

  // Function to populate report dropdowns
  function populateReportDropdowns() {
    // Populate language dropdown
    dom.reportLanguageSelect.innerHTML = "";
    for (const langCode in window.languageServers) {
      const langInfo = getLanguageInfo(langCode);
      const option = document.createElement("option");
      option.value = langCode;
      option.textContent = langInfo.name;
      if (langCode === currentLanguage) {
        option.selected = true;
      }
      dom.reportLanguageSelect.appendChild(option);
    }

    // Populate server dropdown based on current language
    dom.reportServerSelect.innerHTML = "";
    const serversForCurrentLang = window.languageServers[currentLanguage] || [];
    serversForCurrentLang.forEach((server, index) => {
      const option = document.createElement("option");
      option.value = server.name; // Or a unique ID for the server
      option.textContent = server.name;
      if (currentServer && currentServer.url === server.url) {
        option.selected = true;
      }
      dom.reportServerSelect.appendChild(option);
    });
    if (serversForCurrentLang.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No hay servidores disponibles";
      dom.reportServerSelect.appendChild(option);
      dom.reportServerSelect.disabled = true;
    } else {
      dom.reportServerSelect.disabled = false;
    }
  }

  // Function to show a specific report step
  function showReportStep(stepNumber) {
    dom.reportStep1.classList.add("hidden");
    dom.reportStep2.classList.add("hidden");

    if (stepNumber === 1) {
      dom.reportStep1.classList.remove("hidden");
      currentReportStep = 1;
    } else if (stepNumber === 2) {
      dom.reportStep2.classList.remove("hidden");
      currentReportStep = 2;
    }
  }

  // --- EVENTOS DEL REPRODUCTOR DE VIDEO ---
  dom.video.addEventListener("loadedmetadata", () => {
    console.log("Video loadedmetadata event fired.");

    // Directly use dom.video.duration
    let duration = dom.video.duration;

    if (isNaN(duration) || duration === 0) {
      console.warn(
        "Video metadata indicates 0 duration or invalid. Showing poster and loader."
      );
      dom.poster.classList.remove("hidden"); // Keep poster visible
      dom.animeLoaderAnimation.classList.remove("hidden"); // Keep loader visible
      dom.duration.textContent = "00:00";
      dom.timeline.max = 0;
      dom.durationVertical.textContent = "00:00";
      dom.timelineVertical.max = 0;
      dom.video.classList.add("hidden"); // Keep video hidden if metadata is invalid
    } else {
      dom.duration.textContent = formatTime(duration);
      dom.timeline.max = duration;
      dom.durationVertical.textContent = formatTime(duration); // Update vertical duration
      dom.timelineVertical.max = duration; // Update vertical timeline max
      dom.animeLoaderAnimation.classList.add("hidden"); // Hide loader if metadata is valid
      dom.video.classList.remove("hidden"); // Show video once metadata is loaded and valid
    }
  });

  dom.video.addEventListener("durationchange", () => {
    console.log("Video durationchange event fired.");
    const duration = dom.video.duration;
    if (isFinite(duration) && duration > 0) {
      dom.duration.textContent = formatTime(duration);
      dom.timeline.max = duration;
      dom.durationVertical.textContent = formatTime(duration);
      dom.timelineVertical.max = duration;
    }
  });

  dom.video.addEventListener("canplay", () => {
    console.log("Video canplay event fired.");
    dom.animeLoaderAnimation.classList.add("hidden"); // Hide loader when video can play
    // Removed autoplay: dom.video.play();
    showControls();
    // If video is at the beginning and not playing, show poster
    if (dom.video.paused && dom.video.currentTime === 0) {
      dom.poster.classList.remove("hidden");
    }
  });

  dom.video.addEventListener("loadeddata", () => {
    console.log("Video loadeddata event fired.");
  });

  dom.video.addEventListener("error", (e) => {
    const errorMsg = dom.video.error
      ? `Code: ${dom.video.error.code}, Message: ${dom.video.error.message}`
      : "Unknown error";
    console.error("Video error:", e, "MediaError:", errorMsg);
    dom.animeLoaderAnimation.classList.add("hidden"); // Hide loader on error
    // Instead of displaying a specific error message, just hide the loader and show the poster.
    // This allows for a more graceful fallback or silent failure as per user request.
    dom.poster.classList.remove("hidden"); // Show poster on error
    // Optionally, display a user-friendly message
    // dom.title.textContent = "Error al cargar el video. Intenta con otro servidor.";
  });

  dom.iframe.addEventListener("load", () => {
    dom.poster.classList.add("hidden"); // Hide poster when iframe content is loaded
  });

  dom.iframe.addEventListener("error", (e) => {
    console.error("Iframe error:", e);
    // dom.loadingText.textContent = "Error al cargar el contenido del servidor."; // No longer needed
  });

  dom.video.addEventListener("timeupdate", () => {
    const percentage = (dom.video.currentTime / dom.video.duration) * 100;
    dom.timeline.value = dom.video.currentTime;
    dom.timeline.style.setProperty(
      "--progress-value",
      `${percentage}%`
    ); /* Set CSS variable for progress fill */
    dom.currentTime.textContent = formatTime(dom.video.currentTime);

    dom.timelineVertical.value = dom.video.currentTime; // Update vertical timeline
    dom.timelineVertical.style.setProperty(
      "--progress-value",
      `${percentage}%`
    ); // Set CSS variable for vertical progress fill
    dom.currentTimeVertical.textContent = formatTime(dom.video.currentTime); // Update vertical current time

    const tmdbId = contentConfig.goBackId; // Assuming goBackId is the TMDB ID
    if (tmdbId) {
      let yamivideoprogress = JSON.parse(localStorage.getItem("yamivideoprogress") || "{}");
      const progressData = {
        currentTime: dom.video.currentTime,
        duration: dom.video.duration,
      };

      // If it's a series, save episode and season
      if (contentConfig.type === "tv") {
        progressData.season = contentConfig.season;
        progressData.episode = contentConfig.episode;
      }
      yamivideoprogress[tmdbId] = progressData;
      localStorage.setItem("yamivideoprogress", JSON.stringify(yamivideoprogress));
    }

    localStorage.setItem(
      getContentKey(
        contentConfig,
        currentLanguage,
        currentServer ? currentServer.name : null
      ),
      dom.video.currentTime
    );
    updateSkipButtonsVisibility(); // Update visibility on timeupdate
  });
  dom.video.addEventListener("play", () => {
    console.log("Video play event fired.");
    dom.playPauseBtn.textContent = "pause";
    dom.playPauseBtn.classList.remove("hidden"); // Ensure play/pause button is visible
    dom.replayButton.classList.add("hidden"); // Ensure replay button is hidden
    dom.poster.classList.add("hidden"); // Hide poster when video starts playing
    showControls();
    updateSkipButtonsVisibility(); // Update visibility on play
  });
  dom.video.addEventListener("pause", () => {
    console.log("Video pause event fired.");
    showControls();
    clearTimeout(controlsTimeout);
    updateSkipButtonsVisibility(); // Update visibility on pause

    // If video is paused and at the beginning, show poster
    if (dom.video.currentTime === 0) {
      dom.poster.classList.remove("hidden");
    }

    // Always show play_arrow on pause, unless the video has truly ended (handled by 'ended' event)
    if (!dom.video.ended) {
      dom.playPauseBtn.textContent = "play_arrow";
      dom.playPauseBtn.classList.remove("hidden"); // Ensure play/pause button is visible
      dom.replayButton.classList.add("hidden"); // Ensure replay button is hidden
    }
  });
  dom.video.addEventListener("waiting", () => {
    console.log("Video waiting event fired.");
  });
  dom.video.addEventListener("playing", () => {
    console.log("Video playing event fired.");
  });
  dom.video.addEventListener("ended", () => {
    console.log("Video ended event fired.");
    handleVideoEnd();
  });

  // --- EVENTOS DE LOS CONTROLES ---

  // --- EVENTOS DE LOS CONTROLES ---
  dom.playPauseBtn.addEventListener("click", () => {
    if (dom.video.paused) {
      dom.video.play();
      dom.playPauseBtn.classList.add("active"); // Add active class when playing
      // Request fullscreen when playing the video, if not already in fullscreen AND it hasn't been requested this session
      if (
        !document.fullscreenElement &&
        !window.fullscreenRequestedThisSession
      ) {
        toggleFullscreen(dom.wrapper);
        window.fullscreenRequestedThisSession = true; // Set flag to true for this session
      }
    } else {
      dom.video.pause();
      dom.playPauseBtn.classList.remove("active"); // Remove active class when paused
    }
  });
  dom.timeline.addEventListener("input", () => {
    dom.video.currentTime = dom.timeline.value;
    dom.poster.classList.add("hidden"); // Hide poster while scrubbing
  });

  // Pinch-to-zoom functionality for video element
  let initialDistance = 0;
  let isPinching = false;

  dom.video.addEventListener("touchstart", (e) => {
    if (currentServer && currentServer.mp4 && e.touches.length === 2) {
      isPinching = true;
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance = Math.hypot(
        touch1.pageX - touch2.pageX,
        touch1.pageY - touch2.pageY
      );
    }
  });

  dom.video.addEventListener("touchmove", (e) => {
    if (isPinching && e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch1.pageX - touch2.pageX,
        touch1.pageY - touch2.pageY
      );

      const pinchThreshold = 20; // Minimum pixel change to consider it a pinch
      if (Math.abs(currentDistance - initialDistance) > pinchThreshold) {
        if (currentDistance > initialDistance) {
          // Pinch out (zoom in)
          dom.video.classList.add("object-fit-cover");
        } else {
          // Pinch in (zoom out)
          dom.video.classList.remove("object-fit-cover");
        }
        initialDistance = currentDistance; // Update initial distance for continuous pinching
      }
    }
  });

  dom.video.addEventListener("touchend", () => {
    isPinching = false;
  });

  // Event listener for vertical timeline
  dom.timelineVertical.addEventListener("input", () => {
    dom.video.currentTime = dom.timelineVertical.value;
    dom.poster.classList.add("hidden"); // Hide poster while scrubbing
  });

  dom.video.addEventListener("seeking", () => {
    dom.poster.classList.add("hidden"); // Hide poster when seeking
    dom.animeLoaderAnimation.classList.remove("hidden"); // Show loader animation
  });

  dom.video.addEventListener("seeked", () => {
    dom.animeLoaderAnimation.classList.add("hidden"); // Hide loader animation

    // If the user seeks away from the end of the video, show the play/pause button
    // and hide the replay button.
    if (dom.video.currentTime < dom.video.duration - 1) {
      dom.replayButton.classList.add("hidden");
      dom.playPauseBtn.classList.remove("hidden");
      if (dom.video.paused) {
        dom.playPauseBtn.textContent = "play_arrow";
      } else {
        dom.playPauseBtn.textContent = "pause";
      }
    }
    // Re-evaluate skip buttons visibility after seeking
    updateSkipButtonsVisibility();
  });
  dom.fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      // If iframe is active, request fullscreen on the iframe itself or the wrapper
      if (!dom.iframe.classList.contains("hidden")) {
        // Attempt to request fullscreen on the iframe element
        // Note: Fullscreen on iframe content might be restricted by sandbox attributes or cross-origin policies.
        // Requesting fullscreen on the wrapper is a more reliable approach for the entire player.
        dom.wrapper
          .requestFullscreen()
          .catch((err) =>
            console.error("Error requesting fullscreen on wrapper:", err)
          );
      } else {
        // If video is active, request fullscreen on the wrapper
        dom.wrapper
          .requestFullscreen()
          .catch((err) =>
            console.error("Error requesting fullscreen on wrapper:", err)
          );
      }
    } else {
      document.exitFullscreen();
    }
  });
  dom.rewindBtn.addEventListener("click", () => {
    dom.video.currentTime -= 10;
    dom.rewindBtn.classList.add("active");
    setTimeout(() => {
      dom.rewindBtn.classList.remove("active");
    }, 200); // Remove active class after 200ms
  });
  dom.forwardBtn.addEventListener("click", () => {
    dom.video.currentTime += 10;
    dom.forwardBtn.classList.add("active");
    setTimeout(() => {
      dom.forwardBtn.classList.remove("active");
    }, 200); // Remove active class after 200ms
  });
  dom.wrapper.addEventListener("click", (e) => {
    e.stopPropagation(); // Always stop propagation for clicks on the wrapper

    if (isInteractiveControl(e.target)) {
      return; // Do nothing if an interactive control was clicked
    }

    // Otherwise, toggle controls
    if (dom.controls.classList.contains("hidden")) {
      showControls();
      // If "Haz clic para reproducir" is displayed, change it back to the episode title
      if (dom.title.textContent.trim() === "Haz clic para reproducir") {
        console.log(
          "Changing title from 'Haz clic para reproducir' to:",
          currentEpisodeTitle
        );
        dom.title.textContent = currentEpisodeTitle;
        // Only hide poster if video is playing or about to play
        if (!dom.video.paused) {
          dom.poster.classList.add("hidden");
        }
      }
    } else {
      hideControls();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
      dom.fullscreenBtn.textContent = "fullscreen_exit";
      dom.fullscreenBtn.classList.add("fullscreen-active");
    } else {
      dom.fullscreenBtn.textContent = "fullscreen";
      dom.fullscreenBtn.classList.remove("fullscreen-active");
    }
  });
  dom.backBtn.addEventListener("click", () => {
    const goBackId = dom.backBtn.dataset.goBackId;
    if (goBackId) {
      // If goBackId is present, navigate to the custom scheme
      window.location.href = `go:${goBackId}`;
    }
  });

  dom.prevEpisodeBtn.addEventListener("click", () => {
    const prevEpisodeUrl = dom.prevEpisodeBtn.dataset.prevEpisodeUrl;

    if (prevEpisodeUrl) {
      // Check if the URL exists
      window.location.href = prevEpisodeUrl;
    } else {
      const currentEpisode = parseInt(contentConfig.episode);
      if (currentEpisode > 1) {
        changeEpisode(currentEpisode - 1);
      } else {
        alert("Ya estás en el primer episodio.");
      }
    }
  });

  dom.nextEpisodeBtn.addEventListener("click", () => {
    const nextEpisodeUrl = dom.nextEpisodeBtn.dataset.nextEpisodeUrl;

    if (nextEpisodeUrl) {
      // Check if the URL exists
      window.location.href = nextEpisodeUrl;
    } else {
      const currentEpisode = parseInt(contentConfig.episode);
      changeEpisode(currentEpisode + 1);
    }
  });

  // Event listeners for vertical episode navigation / rewind/forward
  dom.prevEpisodeBtnVertical.addEventListener("click", () => {
    const prevEpisodeUrl = dom.prevEpisodeBtnVertical.dataset.prevEpisodeUrl;

    if (prevEpisodeUrl) {
      // Check if the URL exists
      window.location.href = prevEpisodeUrl;
    } else {
      const currentEpisode = parseInt(contentConfig.episode);
      if (currentEpisode > 1) {
        changeEpisode(currentEpisode - 1);
      } else {
        alert("Ya estás en el primer episodio.");
      }
    }
  });

  dom.nextEpisodeBtnVertical.addEventListener("click", () => {
    const nextEpisodeUrl = dom.nextEpisodeBtnVertical.dataset.nextEpisodeUrl;

    if (nextEpisodeUrl) {
      // Check if the URL exists
      window.location.href = nextEpisodeUrl;
    } else {
      const currentEpisode = parseInt(contentConfig.episode);
      changeEpisode(currentEpisode + 1);
    }
  });

  // Eventos para abrir el modal de selección de idioma
  if (dom.openLanguageModalBtn) {
    dom.openLanguageModalBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      hideAllPopups();
      dom.popups.languageSelection.classList.remove("hidden");
      selectedLanguageInModal = currentLanguage; // Initialize with current active language
      populateLanguageButtons(); // Populate buttons when modal opens
    });
  }

  if (dom.openLanguageModalBtnVertical) {
    dom.openLanguageModalBtnVertical.addEventListener("click", (e) => {
      e.stopPropagation();
      hideAllPopups();
      dom.popups.languageSelection.classList.remove("hidden");
      selectedLanguageInModal = currentLanguage; // Initialize with current active language
      populateLanguageButtons(); // Populate buttons when modal opens
    });
  }

  // Event listeners for opening the server selection modal
  if (dom.openServerModalBtn) {
    dom.openServerModalBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      hideAllPopups();
      dom.popups.serverSelection.classList.remove("hidden");
      selectedServerInModal = currentServer; // Initialize with current active server
      console.log("Opening server modal. currentServer:", currentServer);
      console.log("selectedServerInModal (on open):", selectedServerInModal);
      populateServerButtons(); // Populate buttons when modal opens
    });
  }

  if (dom.openServerModalBtnVertical) {
    dom.openServerModalBtnVertical.addEventListener("click", (e) => {
      e.stopPropagation();
      hideAllPopups();
      dom.popups.serverSelection.classList.remove("hidden");
      selectedServerInModal = currentServer; // Initialize with current active server
      console.log(
        "Opening vertical server modal. currentServer:",
        currentServer
      );
      console.log("Opening server modal. currentServer:", currentServer);
      console.log("selectedServerInModal (on open):", selectedServerInModal);
      // When the modal opens, ensure the currently playing server is pre-selected.
      // The populateServerButtons function will use 'currentServer' to apply the 'selected' class.
      populateServerButtons(); // Populate buttons when modal opens
    });
  }

  // Eventos para cerrar popups
  dom.closePopupBtns.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      hideAllPopups();
    });
  });

  document.addEventListener("click", (e) => {
    // Hide all popups if click is outside of them and not on controls
    if (
      !e.target.closest(".popup") &&
      !e.target.closest(".bottom-controls") &&
      !e.target.closest(".top-bar") &&
      !e.target.closest(".vertical-menu-container") // Add vertical menu container
    ) {
      hideAllPopups();
    }
  });

  // --- NUEVOS BOTONES ---
  // --- NUEVOS BOTONES ---
  if (dom.openExternalBtn) {
    dom.openExternalBtn.addEventListener("click", () => {
      console.log("Open external button clicked.");
      console.log("currentServer:", currentServer);
      console.log(
        "currentServer.url:",
        currentServer ? currentServer.url : "N/A"
      );

      if (currentServer && currentServer.url) {
        const url = currentServer.url;
        const absoluteUrl = new URL(url, window.location.origin);
        const scheme = absoluteUrl.protocol.slice(0, -1); // "http" or "https"
        const urlWithoutScheme = absoluteUrl.href.replace(
          `${absoluteUrl.protocol}//`,
          ""
        );
        const intentUrl = `intent://${urlWithoutScheme}#Intent;action=android.intent.action.VIEW;type=video/*;scheme=${scheme};end`;
        window.open(intentUrl, "_system");
      } else {
        console.warn("No server URL selected for external opening."); // Log a warning
        alert("No hay URL de servidor seleccionada para abrir.");
      }
    });
  }

  if (dom.downloadBtn) {
    dom.downloadBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      hideAllPopups();
      dom.popups.downloadServers.classList.remove("hidden");
      populateDownloadServersDropdown();
    });
  }

  if (dom.downloadBtnVertical) {
    dom.downloadBtnVertical.addEventListener("click", (e) => {
      e.stopPropagation();
      hideAllPopups();
      dom.popups.downloadServers.classList.remove("hidden");
      populateDownloadServersDropdown();
    });
  }

  if (dom.startDownloadBtn) {
    dom.startDownloadBtn.addEventListener("click", handleDownloadInitiation);
  }

  // Evento para el botón de reporte
  if (dom.reportBtn) {
    dom.reportBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      hideAllPopups();
      dom.popups.report.classList.remove("hidden");
      populateReportDropdowns();
      showReportStep(1); // Show the first step when opening the report modal

      // --- CONFIGURACIÓN DE TELEGRAM PARA EL REPORTE ---
      // IMPORTANTE: Reemplaza estos valores con los datos reales de tu bot y chat.
      // Estos valores se usarán para enviar el reporte a Telegram.
      dom.reportChatId.value = "-1003012512019"; // Ejemplo: "123456789"
      dom.reportToken.value = "7501592844:AAFR8K1wZEdie8g8F4FY3rVtKyM3EEZ8xg0"; // Ejemplo: "123456:ABC-DEF1234ghIkl-798989898989"
      dom.reportTopic.value = "102"; // Opcional, ejemplo: "123" (para un topic específico en un grupo)
      // --- FIN DE CONFIGURACIÓN DE TELEGRAM ---
    });
  }

  // Event listeners for report form navigation
  if (dom.reportNextBtn) {
    dom.reportNextBtn.addEventListener("click", () => {
      showReportStep(currentReportStep + 1);
    });
  }

  if (dom.reportPrevBtn) {
    dom.reportPrevBtn.addEventListener("click", () => {
      showReportStep(currentReportStep - 1);
    });
  }

  // Evento para el envío del formulario de reporte
  if (dom.reportForm) {
    dom.reportForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent default form submission
      const reportData = {
        server: dom.reportServerSelect.value,
        language: dom.reportLanguageSelect.value,
        reportType: dom.reportTypeStreaming.checked ? "streaming" : "download", // Get selected report type
        seriesName: currentSeriesName, // Add series name
        seasonNumber: currentSeasonNumber, // Add season number
        episodeNumber: currentEpisodeNumber, // Add episode number
        contentType: contentConfig.type, // Add content type
        // contentSynopsis: currentContentSynopsis, // Removed synopsis
        contentPosterUrl: currentContentPosterUrl, // Add poster URL
        description: dom.reportDescription.value, // Add report description
        currentUrl: window.location.href,
        currentServerUrl: currentServer ? currentServer.url : "N/A",
        chat_id: dom.reportChatId.value,
        token: dom.reportToken.value,
        topic: dom.reportTopic.value,
      };
      sendTelegramReport(reportData);
      hideAllPopups(); // Hide the report form
      dom.popups.reportConfirmation.classList.remove("hidden"); // Show the confirmation modal
    });
  }

  // Event for the OK button in the report confirmation modal
  if (dom.reportConfirmationOkBtn) {
    dom.reportConfirmationOkBtn.addEventListener("click", () => {
      dom.popups.reportConfirmation.classList.add("hidden"); // Hide the confirmation modal
    });
  }

  // --- INICIALIZACIÓN ---
  async function startPlayback() {
    if (playerInitialized) return; // Prevent re-initialization
    playerInitialized = true;

    const posterUrl = await fetchContentData(); // This will return contentConfig.posterUrl if available, or TMDB poster.

    const loadVideo = () => {
      // Initialize with the first server of the default language
      const defaultServers = window.languageServers[currentLanguage];
      if (defaultServers && defaultServers.length > 0) {
        loadSource(defaultServers[0]);
      } else {
        // dom.loadingText.textContent = "No hay servidores para este contenido en el idioma por defecto."; // No longer needed
      }
    };

    // If a poster URL is available (either from contentConfig or TMDB), set it.
    // The dom_builder already sets it if contentConfig.posterUrl is present,
    // but this ensures it's set if fetched from TMDB.
    if (posterUrl) {
      dom.poster.style.backgroundImage = `url(${posterUrl})`;
      dom.poster.classList.remove("hidden"); // Ensure poster is visible
    } else {
      dom.poster.classList.add("hidden"); // Hide poster if no URL is available
    }

    // Always load the video after handling the poster.
    loadVideo();
  }

  function stopPlayback() {
    if (dom.video) {
      dom.video.pause();
      dom.video.src = ""; // Clear video source
      dom.video.classList.add("hidden");
    }
    if (dom.iframe) {
      dom.iframe.src = "about:blank"; // Clear iframe source
      dom.iframe.classList.add("hidden");
    }
    dom.poster.classList.remove("hidden"); // Show poster when stopped
    dom.controls.classList.add("hidden"); // Hide controls
    dom.bottomBar.classList.add("hidden"); // Hide bottom bar
    playerInitialized = false;
  }

  // Update the text in the server selection buttons
  updateServerSelectText();

  // Initially hide skip buttons and their containers
  dom.skipIntroBtn.classList.add("hidden");
  dom.skipEndingBtn.classList.add("hidden");
  dom.skipButtonsContainer.classList.remove("active");
  dom.verticalSkipIntroBtn.classList.add("hidden");
  dom.verticalSkipEndingBtn.classList.add("hidden");

  startPlayback();

  // Event listener for the replay button
  if (dom.replayButton) {
    dom.replayButton.addEventListener("click", () => {
      if (currentServer) {
        loadSource(currentServer, 0); // Reload the source from the beginning
        dom.replayButton.classList.add("hidden"); // Hide replay button
        dom.playPauseBtn.classList.remove("hidden"); // Show play/pause button
        dom.playPauseBtn.textContent = "pause"; // Set to pause icon
        dom.poster.classList.add("hidden"); // Hide poster immediately
        dom.video.classList.remove("hidden"); // Ensure video element is visible
        dom.video.play(); // Start playback
      } else {
        console.warn("No current server available to replay.");
      }
    });
  }
});
