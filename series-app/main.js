import {
  buildHeader,
  buildMainContent,
  buildNavigationBar,
  buildMovieDetailPage,
} from "./dom-builder.js";
import { fetchMediaDetails } from "./script.js";


// Global function to set adult content preference and dispatch event
window.setAdultContentEnabled = (isEnabled) => {
  localStorage.setItem("adultContentEnabled", isEnabled ? "true" : "false");
  window.dispatchEvent(new Event("adultContentSettingChanged"));
  console.log("Adult content setting changed to:", isEnabled);
};

document.addEventListener("DOMContentLoaded", async () => {
  const apiBaseUrl = "https://api.themoviedb.org/3";
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const backdropBaseUrl = "https://image.tmdb.org/t/p/w780";

  // Function to parse URL query parameters
  const getQueryParams = () => {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    return params;
  };

  const queryParams = getQueryParams();
  const bodyElement = document.body;
  const defaultTheme = bodyElement.dataset.defaultTheme || "orange"; // Default to 'orange' if attribute is not set

  let isPurpleTheme = false;
  if (queryParams.theme) {
    isPurpleTheme = queryParams.theme === "purple";
  } else {
    isPurpleTheme = defaultTheme === "purple";
  }

  const appRoot = document.getElementById("app-root");
  appRoot.appendChild(buildHeader(null, isPurpleTheme)); // Pass isPurpleTheme to buildHeader
  appRoot.appendChild(buildMainContent());

  const movieDetailSection = document.getElementById("movie-detail-section");
  const navContainer = document.createElement("div"); // Create a container for the navigation bar
  navContainer.id = "nav-bar-container";
  appRoot.appendChild(navContainer);

  const renderNavigationBar = () => {
    console.log("renderNavigationBar called.");
    const adultContentEnabled = localStorage.getItem("adultContentEnabled") === "true";
    console.log("adultContentEnabled from localStorage:", adultContentEnabled);
    const adultContentLink = navContainer.querySelector("#adult-content-nav-link");

    if (adultContentLink) {
      console.log("adult-content-nav-link found.");
      if (adultContentEnabled) {
        adultContentLink.classList.remove("hidden"); // Show the link
        console.log("Removed 'hidden' class. Current classes:", adultContentLink.classList.value);
      } else {
        adultContentLink.classList.add("hidden"); // Hide the link
        console.log("Added 'hidden' class. Current classes:", adultContentLink.classList.value);
      }
    } else {
      console.log("adult-content-nav-link NOT found.");
    }
  };

  // Initial render of the navigation bar
  // The buildNavigationBar function now always includes the link,
  // and its initial visibility is set by the 'hidden' class based on adultContentEnabled.
  navContainer.appendChild(buildNavigationBar(localStorage.getItem("adultContentEnabled") === "true", isPurpleTheme)); // Pass isPurpleTheme to buildNavigationBar

  // Listen for custom event to update navigation bar visibility
  window.addEventListener("adultContentSettingChanged", renderNavigationBar);

  // Listen for storage event to update navigation bar visibility if localStorage changes externally
  window.addEventListener("storage", (event) => {
    if (event.key === "adultContentEnabled") {
      console.log("localStorage 'adultContentEnabled' changed externally. Re-rendering navigation bar.");
      renderNavigationBar();
    }
  });

  const path = window.location.pathname;
  const pathParts = path.split("/").filter(Boolean); // Remove empty strings

  let mediaId = null;
  let mediaType = null;
  let seasonNumber = null;
  let episodeNumber = null;
  let episodeType = null; // New variable for episode type

  // Check if it's the home route (go:home#home)
  const isHomeRoute =
    window.location.hash === "#home" &&
    pathParts.length >= 1 &&
    pathParts[0] === "go";

  if (isHomeRoute) {
    // Clear the movie detail section and ensure main content is visible
    movieDetailSection.innerHTML = "";
    // Optionally, you might want to load specific "home" content here
    // For now, just ensuring the movie detail section is empty and not showing an error.
  } else {
    // Read mediaType and mediaId from local-media-data div
    const localMediaDataElement = document.getElementById("local-media-data");
    if (localMediaDataElement) {
      mediaType = localMediaDataElement.dataset.mediaType || null;
      mediaId = localMediaDataElement.dataset.mediaId || null;
      seasonNumber = localMediaDataElement.dataset.seasonNumber ? parseInt(localMediaDataElement.dataset.seasonNumber) : null;
      episodeNumber = localMediaDataElement.dataset.episodeNumber ? parseInt(localMediaDataElement.dataset.episodeNumber) : null;
      episodeType = localMediaDataElement.dataset.episodeType || null;
    }

    // Existing logic to override season and episode with URL path parameters if present.
    // Query parameters for season/episode are no longer considered as per user's request.
    if (pathParts.length >= 2 && pathParts[0] === "go") {
      const seasonIndex = pathParts.indexOf("season");
      const episodeIndex = pathParts.indexOf("episode");

      // Apply path parameters if not already set by localMediaDataElement
      if (seasonIndex !== -1 && pathParts[seasonIndex + 1] && seasonNumber === null) {
        seasonNumber = parseInt(pathParts[seasonIndex + 1]);
      }
      if (episodeIndex !== -1 && pathParts[episodeIndex + 1] && episodeNumber === null) {
        episodeNumber = parseInt(pathParts[episodeIndex + 1]);
      }
    }
    let localEpisodesDb = {}; // Initialize as empty, will be populated from script tag
    // Fallback to reading from Inicio.html if not in URL (for backward compatibility or if the script tag is still there)
    if (Object.keys(localEpisodesDb).length === 0) {
      const localEpisodesDbScript = document.getElementById("local-episodes-db");
      if (localEpisodesDbScript && localEpisodesDbScript.textContent) {
        try {
          localEpisodesDb = JSON.parse(localEpisodesDbScript.textContent);
        } catch (e) {
          console.error("Error parsing local-episodes-db from script tag:", e);
        }
      }
    }

    const mediaDetails = await fetchMediaDetails(
      apiBaseUrl,
      mediaType,
      mediaId,
      seasonNumber,
      episodeNumber,
      episodeType // Pass the new episodeType
    );

    if (mediaDetails) {
      const mediaDetailPageElement = await buildMovieDetailPage(
        apiBaseUrl,
        backdropBaseUrl,
        imageBaseUrl,
        mediaDetails,
        mediaType,
        mediaId,
        seasonNumber,
        episodeNumber,
        episodeType, // Pass the new episodeType
        localEpisodesDb, // Pass the local episodes database
        isPurpleTheme // Pass the isPurpleTheme flag
      );
      movieDetailSection.appendChild(mediaDetailPageElement);
    } else {
      movieDetailSection.innerHTML =
        "<p class='text-center text-red-500'>No se pudo cargar la información del contenido.</p>";
    }
  }
});
