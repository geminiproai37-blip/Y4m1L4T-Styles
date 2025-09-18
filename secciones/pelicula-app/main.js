import {
  buildHeader,
  buildMainContent,
  buildMovieDetailPage,
} from "./dom-builder.js";
import { fetchMediaDetails } from "./script.js";

document.addEventListener("DOMContentLoaded", async () => {
  const apiBaseUrl = "https://api.themoviedb.org/3";
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
  const backdropBaseUrl = "https://image.tmdb.org/t/p/w780";
  const adultContentEnabled = localStorage.getItem("adultContentEnabled") === "true";

  const appRoot = document.getElementById("app-root");
  appRoot.appendChild(buildHeader());
  appRoot.appendChild(buildMainContent());

  const movieDetailSection = document.getElementById("movie-detail-section");

  const path = window.location.pathname;
  const pathParts = path.split("/").filter(Boolean); // Remove empty strings

  let mediaId = null;
  let mediaType = null;
  let seasonNumber = null;
  let episodeNumber = null;

  // Read all media data from local-media-data div as the primary source
  const localMediaDataElement = document.getElementById("local-media-data");
  let playUrlTemplate = null;
  if (localMediaDataElement) {
    mediaType = localMediaDataElement.dataset.mediaType;
    mediaId = localMediaDataElement.dataset.mediaId;
    playUrlTemplate = localMediaDataElement.dataset.playUrlTemplate;
  }

  const mediaDetails = await fetchMediaDetails(apiBaseUrl, mediaType, mediaId);

  if (mediaDetails) {
    const mediaDetailPageElement = await buildMovieDetailPage(
      apiBaseUrl,
      backdropBaseUrl,
      imageBaseUrl,
      mediaDetails,
      mediaType,
      mediaId,
      playUrlTemplate,
      adultContentEnabled
    );
    movieDetailSection.appendChild(mediaDetailPageElement);
  } else {
    movieDetailSection.innerHTML =
      "<p class='text-center text-red-500'>No se pudo cargar la información del contenido.</p>";
  }
});
