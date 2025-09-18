import {
  fetchMediaDetails,
  fetchCast,
  fetchMediaVideos,
  fetchTvSeasonDetails,
  fetchEpisodeDetails,
} from "./script.js";

export function buildHeader(backButtonTargetId = null, isPurpleTheme = false) {
  const header = document.createElement("header");
  header.className =
    "bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 py-3 px-4 flex justify-between items-center border-b border-gray-800 max-w-4xl mx-auto";

  header.innerHTML = `
    <div class="flex items-center space-x-2">
      <button id="back-btn" aria-label="Regresar" class="text-gray-400 hover:text-white transition mr-2">
        <i class="fas fa-arrow-left text-lg md:text-xl"></i>
      </button>
      ${
        isPurpleTheme
          ? `<i class="fas fa-fire h-5 w-5 md:h-6 md:w-6 text-purple-adult"></i>`
          : `<svg class="h-5 w-5 md:h-6 md:w-6 text-orange-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9a2.25 2.25 0 0 0-2.25 2.25v9A2.25 2.25 0 0 0 4.5 18.75Z" />
            </svg>`
      }
      <h1 class="font-bold text-white ml-1">
        <span class="text-yami-adult">Yami</span><span class="${
          isPurpleTheme ? "text-purple-adult" : "text-orange-500"
        }">${isPurpleTheme ? "H" : "Lat"}</span>
      </h1>
    </div>
    <div class="flex items-center space-x-4">
      <button id="search-btn" aria-label="Buscar" class="text-gray-400 hover:text-white transition">
        <i class="fas fa-search text-lg md:text-xl"></i>
      </button>
    </div>
  `;

  // Acciones (puedes reemplazar con funciones reales en vez de redirección)
  header.querySelector("#search-btn").addEventListener("click", () => {
    window.location.href = "go:buscador";
  });
  header.querySelector("#back-btn").addEventListener("click", () => {
    window.location.href = "go:home";
  });

  return header;
}

export function buildMainContent() {
  const main = document.createElement("main");
  main.id = "main-content";
  main.className = "";

  main.innerHTML = `
    <!-- Mensaje API Key -->
    <div
      id="api-key-message"
      class="hidden bg-red-800 border-l-4 border-red-500 text-red-100 p-4 rounded-lg m-5"
      role="alert"
    >
      <p class="font-bold">Error de Configuración</p>
      <p>
        Por favor, introduce tu clave de API de TMDB en la variable \`apiKey\`
        del script para cargar el contenido.
      </p>
    </div>

    <!-- Movie Detail Section -->
    <div id="movie-detail-section" class="w-full">
      <!-- Movie detail content will be loaded here by script.js -->
    </div>
  `;
  return main;
}

export function buildNavigationBar(adultContentEnabled = false, isPurpleTheme = false) {
  const nav = document.createElement("nav");
  nav.className =
    "fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 flex justify-around p-2 z-50";

  let navContent = `
    <a href="go:home" aria-label="Inicio" data-section="home" class="nav-link flex flex-col items-center text-gray-400 hover:${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'} w-1/4 py-1 rounded-lg transition">
      <i class="fas fa-home text-lg md:text-xl mb-1"></i>
      <span class="text-xs font-semibold">Inicio</span>
    </a>
    <a href="go:series" aria-label="Series" data-section="series" class="nav-link flex flex-col items-center text-gray-400 hover:${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'} w-1/4 py-1 rounded-lg transition">
      <i class="fas fa-tv text-lg md:text-xl mb-1"></i>
      <span class="text-xs font-semibold">Series</span>
    </a>
    <a href="go:peliculas" aria-label="Películas" data-section="peliculas" class="nav-link flex flex-col items-center text-gray-400 hover:${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'} w-1/4 py-1 rounded-lg transition">
      <i class="fas fa-film text-lg md:text-xl mb-1"></i>
      <span class="text-xs font-semibold">Películas</span>
    </a>
    <a href="go:adult-content" aria-label="Contenido +18" data-section="adult-content" id="adult-content-nav-link" class="nav-link flex flex-col items-center text-gray-400 hover:text-red-500 w-1/4 py-1 rounded-lg transition ${adultContentEnabled ? '' : 'hidden'}">
      <i class="fas fa-fire text-lg md:text-xl mb-1"></i>
      <span class="text-xs font-semibold">+18</span>
    </a>
    <a href="go:configuracion" aria-label="Configuración" data-section="configuracion" class="nav-link flex flex-col items-center text-gray-400 hover:${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'} w-1/4 py-1 rounded-lg transition">
      <i class="fas fa-cog text-lg md:text-xl mb-1"></i>
      <span class="text-xs font-semibold">Configuración</span>
    </a>
  `;

  nav.innerHTML = navContent;
  return nav;
}

export async function buildMovieDetailPage(
  apiBaseUrl,
  backdropBaseUrl,
  imageBaseUrl,
  mediaDetails,
  mediaType,
  mediaId,
  seasonNumber,
  episodeNumber,
  episodeType, // New parameter
  localEpisodesDb,
  isPurpleTheme = false // Add isPurpleTheme parameter with a default value
) {
  const movie = mediaDetails; // For backward compatibility with existing code
  const mediaIdStr = String(mediaId); // Declare mediaIdStr once at a higher scope
  const movieDetailContainer = document.createElement("div");
  movieDetailContainer.className =
    "relative w-full min-h-screen bg-gray-900 text-white pb-20"; // Full height, app background, padding for nav

  // Content
  const contentWrapper = document.createElement("div");
  contentWrapper.className = "relative z-10 p-5 max-w-4xl mx-auto"; // Centered, max-width for content

  // Container for media display (trailer/backdrop + logo)
  const mediaDisplayContainer = document.createElement("div");
  mediaDisplayContainer.className =
    "relative w-full aspect-video mb-4 rounded-lg overflow-hidden shadow-lg"; // 16:9 aspect ratio, relative for logo positioning
  contentWrapper.appendChild(mediaDisplayContainer);

  // Trailer or 16:9 Image
  const videos = await fetchMediaVideos(apiBaseUrl, mediaType, movie.id);
  const trailer = videos.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  console.log("Found trailer:", trailer); // Debugging line

  // Always show backdrop if available, otherwise fallback
  if (movie.backdrop_path) {
    mediaDisplayContainer.style.backgroundImage = `url(${backdropBaseUrl}${movie.backdrop_path})`;
    mediaDisplayContainer.style.backgroundSize = "cover";
    mediaDisplayContainer.style.backgroundPosition = "center";
  } else {
    // Fallback if no backdrop
    mediaDisplayContainer.style.backgroundColor = "#1f2937"; // gray-800
    mediaDisplayContainer.innerHTML = `
      <div class="flex items-center justify-center w-full h-full text-gray-500 text-xl">
        No hay imagen disponible
      </div>
    `;
  }

  // Movie Logo (positioned absolutely at the bottom center of the mediaDisplayContainer)
  if (movie.logo_path) {
    const logo = document.createElement("img");
    logo.src = `https://image.tmdb.org/t/p/original${movie.logo_path}`;
    logo.alt = `${movie.title || movie.name} logo`;
    logo.className =
      "absolute bottom-4 left-4 max-w-[150px] h-auto drop-shadow-lg z-10"; // Larger, bottom-left
    mediaDisplayContainer.appendChild(logo);
  }

  // Movie Title and Categories (below media display)
  const titleAndGenresContainer = document.createElement("div");
  titleAndGenresContainer.className =
    "flex flex-col md:flex-row md:items-center md:justify-between mb-3";
  contentWrapper.appendChild(titleAndGenresContainer);

  // Display title if no logo was shown in the media display container
  if (!movie.logo_path) {
    const title = document.createElement("h1");
    title.className =
      "text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-0 drop-shadow-lg text-center"; // Centered title
    title.textContent = movie.title || movie.name;
    titleAndGenresContainer.appendChild(title);
  }

  // Categories/Genres, Year, and Age Category
  const categoriesAndMetadataContainer = document.createElement("div");
  categoriesAndMetadataContainer.className =
    "flex flex-wrap gap-2 mt-2 md:mt-0 md:ml-4"; // Use similar styling as genresContainer

  if (movie.genres && movie.genres.length > 0) {
    movie.genres.forEach((genre) => {
      const genreSpan = document.createElement("span");
      genreSpan.className =
        `${isPurpleTheme ? 'bg-purple-adult' : 'bg-orange-500'} text-white text-xs px-2 py-0.5 rounded-full`;
      genreSpan.textContent = genre.name;
      categoriesAndMetadataContainer.appendChild(genreSpan);
    });
  }

  // Add year for movies here, if mediaType is movie
  if (mediaType === "movie" && movie.release_date) {
    const movieYearSpan = document.createElement("span");
    movieYearSpan.className =
      "bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full";
    movieYearSpan.textContent = movie.release_date.substring(0, 4);
    categoriesAndMetadataContainer.appendChild(movieYearSpan);
  }

  const ageRatingSpan = document.createElement("span");
  ageRatingSpan.className =
    "bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full"; // New style for age rating
  ageRatingSpan.textContent = movie.adult ? "+18" : "TP"; // Simple placeholder
  categoriesAndMetadataContainer.appendChild(ageRatingSpan);

  // Only append if there's content
  if (categoriesAndMetadataContainer.children.length > 0) {
    titleAndGenresContainer.appendChild(categoriesAndMetadataContainer);
  }

  // Seasons information - moved here to be after categories/year/age
  if (localEpisodesDb[mediaIdStr]) {
    const numberOfLocalSeasons = Object.keys(
      localEpisodesDb[mediaIdStr]
    ).length;
    if (numberOfLocalSeasons > 0) {
      const seasonsContainer = document.createElement("div");
      seasonsContainer.className = "text-gray-400 text-sm mb-4 mt-2"; // Simple styling, added mt-2 for spacing
      const seasonsSpan = document.createElement("span");
      seasonsSpan.textContent = `${numberOfLocalSeasons} Temporada${
        numberOfLocalSeasons > 1 ? "s" : ""
      }`;
      seasonsContainer.appendChild(seasonsSpan);

      // Add year for TV series here
      if (mediaType === "tv" && movie.first_air_date) {
        const tvYearSpan = document.createElement("span");
        tvYearSpan.className =
          "ml-2 bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full";
        tvYearSpan.textContent = movie.first_air_date.substring(0, 4);
        seasonsContainer.appendChild(tvYearSpan);
      }
      contentWrapper.appendChild(seasonsContainer); // Append after titleAndGenresContainer
    }
  }

  // Buttons (Play and Add to Favorites) - Moved above tabs, styled as stacked rounded squares
  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "flex flex-col gap-3 mt-4 mb-4"; // Changed to flex-col for stacking
  contentWrapper.appendChild(buttonsContainer);

  // Helper function to update the button's state
  const updateWatchedButtonState = (button) => {
    const mediaId = button.dataset.mediaId;
    const seasonNumber = button.dataset.seasonNumber;
    const episodeNumber = button.dataset.episodeNumber;
    const watchedEpisodes =
      JSON.parse(localStorage.getItem("watchedEpisodes")) || {};
    const isWatched =
      watchedEpisodes[mediaId] &&
      watchedEpisodes[mediaId][seasonNumber] &&
      watchedEpisodes[mediaId][seasonNumber][episodeNumber];

    if (isWatched) {
      button.classList.add("bg-green-600", "hover:bg-green-700", "text-white");
      button.classList.remove(
        "bg-gray-700",
        "hover:bg-gray-600",
        "text-gray-300"
      );
      button.innerHTML = '<i class="fas fa-check-circle mr-1"></i> Visto';
    } else {
      button.classList.add("bg-gray-700", "hover:bg-gray-600", "text-gray-300");
      button.classList.remove(
        "bg-green-600",
        "hover:bg-green-700",
        "text-white"
      );
      button.innerHTML = '<i class="far fa-eye mr-1"></i> Marcar como visto';
    }
  };

  // Helper function to update Yamiprogress
  const updateYamiprogress = (currentMediaId, localEpisodesDb) => {
    if (mediaType !== "tv" || !localEpisodesDb[currentMediaId]) {
      return; // Only track progress for TV shows with local episodes
    }

    const watchedEpisodes =
      JSON.parse(localStorage.getItem("watchedEpisodes")) || {};
    let lastWatchedEpisodeDetails = null;

    const availableSeasons = Object.keys(localEpisodesDb[currentMediaId]).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    for (const sNum of availableSeasons) {
      const episodesInSeason = localEpisodesDb[currentMediaId][sNum].sort(
        (a, b) => a.episode_number - b.episode_number
      );

      for (const episode of episodesInSeason) {
        if (
          watchedEpisodes[currentMediaId] &&
          watchedEpisodes[currentMediaId][sNum] &&
          watchedEpisodes[currentMediaId][sNum][episode.episode_number]
        ) {
          lastWatchedEpisodeDetails = {
            mediaId: currentMediaId,
            seasonNumber: parseInt(sNum),
            episodeNumber: episode.episode_number,
            url: episode.url || `go:${currentMediaId}/season/${sNum}/episode/${episode.episode_number}`,
          };
        }
      }
    }

    let yamiProgress = JSON.parse(localStorage.getItem("Yamiprogress")) || {};
    yamiProgress[currentMediaId] = lastWatchedEpisodeDetails; // Store only the last watched episode details
    localStorage.setItem("Yamiprogress", JSON.stringify(yamiProgress));
    console.log(
      `Yamiprogress updated for mediaId ${currentMediaId}:`,
      lastWatchedEpisodeDetails
    );
  };

  // Helper function to update the play button's state
  const updatePlayButtonState = (playButton, mediaType, mediaIdStr, localEpisodesDb, movie) => {
    console.log("updatePlayButtonState called for mediaId:", mediaIdStr);
    if (mediaType !== "tv" || !localEpisodesDb[mediaIdStr]) {
      // For movies or TV shows without local episodes, link directly to the media detail page
      playButton.href = `go:?mediaType=${mediaType}&mediaId=${movie.id}`;
      playButton.innerHTML = '<i class="fas fa-play mr-2"></i> Reproducir';
      console.log(
        "Not a TV show or no local episodes. Defaulting to Reproducir."
      );
      return;
    }

    const watchedEpisodes =
      JSON.parse(localStorage.getItem("watchedEpisodes")) || {};
    console.log("watchedEpisodes from localStorage:", watchedEpisodes);
    let lastWatchedEpisode = null;
    let firstEpisode = null;

    const availableSeasons = Object.keys(localEpisodesDb[mediaIdStr]).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    for (const sNum of availableSeasons) {
      const episodesInSeason = localEpisodesDb[mediaIdStr][sNum].sort(
        (a, b) => a.episode_number - b.episode_number
      );

      if (!firstEpisode && episodesInSeason.length > 0) {
        firstEpisode = {
          ...episodesInSeason[0],
          season_number: sNum,
          name: episodesInSeason[0].name || `Episodio ${episodesInSeason[0].episode_number}`,
        };
      }

      for (const episode of episodesInSeason) {
        const isWatched =
          watchedEpisodes[mediaIdStr] &&
          watchedEpisodes[mediaIdStr][sNum] &&
          watchedEpisodes[mediaIdStr][sNum][episode.episode_number];

        if (isWatched) {
          lastWatchedEpisode = {
            ...episode,
            season_number: sNum,
            name: episode.name || `Episodio ${episode.episode_number}`,
          };
        }
      }
    }

    console.log("lastWatchedEpisode:", lastWatchedEpisode);
    console.log("firstEpisode:", firstEpisode);

    if (lastWatchedEpisode) {
      playButton.innerHTML = `<i class="fas fa-play mr-2"></i> Continuar viendo E${lastWatchedEpisode.episode_number}: ${lastWatchedEpisode.name}`;
      playButton.href =
        lastWatchedEpisode.url ||
        `go:?mediaType=${mediaType}&mediaId=${movie.id}&seasonNumber=${lastWatchedEpisode.season_number}&episodeNumber=${lastWatchedEpisode.episode_number}`;
    } else if (firstEpisode) {
      playButton.innerHTML = `<i class="fas fa-play mr-2"></i> Reproducir`;
      playButton.href =
        firstEpisode.url ||
        `go:?mediaType=${mediaType}&mediaId=${movie.id}&seasonNumber=${firstEpisode.season_number}&episodeNumber=${firstEpisode.episode_number}`;
    } else {
      // Fallback if no episodes are found at all (shouldn't happen if localEpisodesDb[mediaIdStr] is true)
      playButton.innerHTML = `<i class="fas fa-play mr-2"></i> Reproducir`;
      playButton.href = `go:?mediaType=${mediaType}&mediaId=${movie.id}`;
    }
  };

  // Helper function to mark episode as watched
  const markEpisodeAsWatched = (mediaId, seasonNumber, episodeNumber) => {
    let watchedEpisodes =
      JSON.parse(localStorage.getItem("watchedEpisodes")) || {};

    if (!watchedEpisodes[mediaId]) {
      watchedEpisodes[mediaId] = {};
    }
    if (!watchedEpisodes[mediaId][seasonNumber]) {
      watchedEpisodes[mediaId][seasonNumber] = {};
    }

    // Explicitly set to true
    watchedEpisodes[mediaId][seasonNumber][episodeNumber] = true;

    localStorage.setItem("watchedEpisodes", JSON.stringify(watchedEpisodes));

    // Find and update the specific mark-watched-btn for this episode
    const markWatchedBtn = document.querySelector(
      `button.mark-watched-btn[data-media-id="${mediaId}"][data-season-number="${seasonNumber}"][data-episode-number="${episodeNumber}"]`
    );
    if (markWatchedBtn) {
      updateWatchedButtonState(markWatchedBtn);
    }

    updatePlayButtonState(
      playButton,
      mediaType,
    mediaIdStr,
      localEpisodesDb,
      movie
    ); // Update main play button
    updateYamiprogress(mediaIdStr, localEpisodesDb); // Update Yamiprogress
  };

  // Helper function to toggle watched status (for the explicit "Mark as watched" button)
  // Helper function to check if auto-view is enabled
  const isAutoViewEnabled = () => {
    try {
      const setting = localStorage.getItem("autoViewEnabled");
      return setting === "true"; // Returns true if explicitly "true", false otherwise
    } catch (e) {
      console.error("Error reading autoViewEnabled from localStorage:", e);
      return false; // Default to false if there's an error or setting is not found
    }
  };

  // Helper function to toggle watched status (for the explicit "Mark as watched" button)
  const toggleEpisodeWatched = (button) => {
    const mediaId = button.dataset.mediaId;
    const seasonNumber = button.dataset.seasonNumber;
    const episodeNumber = button.dataset.episodeNumber;
    let watchedEpisodes =
      JSON.parse(localStorage.getItem("watchedEpisodes")) || {};

    if (!watchedEpisodes[mediaId]) {
      watchedEpisodes[mediaId] = {};
    }
    if (!watchedEpisodes[mediaId][seasonNumber]) {
      watchedEpisodes[mediaId][seasonNumber] = {};
    }

    const isWatched = watchedEpisodes[mediaId][seasonNumber][episodeNumber];
    watchedEpisodes[mediaId][seasonNumber][episodeNumber] = !isWatched; // This line toggles

    localStorage.setItem("watchedEpisodes", JSON.stringify(watchedEpisodes));
    updateWatchedButtonState(button);
    updatePlayButtonState(
      playButton,
      mediaType,
      mediaIdStr,
      localEpisodesDb,
      movie
    ); // Update main play button
    updateYamiprogress(mediaIdStr, localEpisodesDb); // Update Yamiprogress
  };

  const playButton = document.createElement("a");
  playButton.className =
    "bg-white text-gray-900 px-6 py-3 rounded-lg font-bold flex items-center justify-center transition-colors hover:bg-gray-300 text-base"; // Play button should not change color based on theme
  buttonsContainer.appendChild(playButton);

  // Set the initial state of the play button when the page loads
  updatePlayButtonState(
    playButton,
    mediaType,
    mediaIdStr,
    localEpisodesDb,
    movie
  );

  // Add event listener to the main play button
  playButton.addEventListener("click", (event) => {
    // Prevent default navigation for now, we'll handle it after marking as watched
    event.preventDefault();

    const href = playButton.href;
    const url = new URL(href);
    const mediaId = url.searchParams.get("mediaId");
    const seasonNumber = url.searchParams.get("seasonNumber");
    const episodeNumber = url.searchParams.get("episodeNumber");

    // Only mark as watched if autoViewEnabled is true
    if (isAutoViewEnabled()) {
      markEpisodeAsWatched(mediaId, seasonNumber, episodeNumber);
    }

    // Now navigate to the episode URL
    window.location.href = href;
  });

  // Trailer Button
  const trailerButton = document.createElement("button");
  trailerButton.id = "trailer-btn";
  trailerButton.className =
    `${isPurpleTheme ? 'bg-purple-adult hover:bg-purple-dark' : 'bg-orange-500 hover:bg-orange-600'} text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center transition-colors text-base`; // Changed orange shades slightly
  trailerButton.innerHTML = '<i class="fas fa-film mr-2"></i> Ver Trailer';
  buttonsContainer.appendChild(trailerButton);

  const myListButton = document.createElement("button");
  myListButton.className =
    "bg-gray-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center transition-colors hover:bg-gray-600 text-base"; // Larger, rounded-lg
  buttonsContainer.appendChild(myListButton);

  const updateFavoriteButton = () => {
    let favorites = JSON.parse(localStorage.getItem("yamiLatFavorites"));
    if (!Array.isArray(favorites)) {
      favorites = [];
    }
    const existingItem = favorites.find(
      (fav) => fav.id === movie.id && fav.type === mediaType
    );

    if (existingItem) {
      myListButton.innerHTML =
        '<i class="fas fa-check mr-2"></i> Añadido a Favoritos';
      myListButton.classList.add("added-to-favorites");
    } else {
      myListButton.innerHTML =
        '<i class="fas fa-plus mr-2"></i> Añadir a Favoritos';
      myListButton.classList.remove("added-to-favorites");
    }
  };

  updateFavoriteButton();

  myListButton.addEventListener("click", () => {
    let favorites = JSON.parse(localStorage.getItem("yamiLatFavorites"));
    if (!Array.isArray(favorites)) {
      favorites = [];
    }
    const existingItem = favorites.find(
      (fav) => fav.id === movie.id && fav.type === mediaType
    );

    if (!existingItem) {
      favorites.push({
        id: movie.id,
        type: mediaType,
        title:
          mediaType === "tv"
            ? movie.series_name || movie.name
            : movie.title || movie.name,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
      });
      localStorage.setItem("yamiLatFavorites", JSON.stringify(favorites));
      // showNotification(`${movie.title || movie.name} ha sido añadido a tus favoritos!`, "success");
    } else {
      favorites = favorites.filter(
        (fav) => !(fav.id === movie.id && fav.type === mediaType)
      );
      localStorage.setItem("yamiLatFavorites", JSON.stringify(favorites));
      // showNotification(`${movie.title || movie.name} ha sido eliminado de tus favoritos.`, "info");
    }
    updateFavoriteButton();
  });
  buttonsContainer.appendChild(myListButton);

  // Tabs
  const tabsContainer = document.createElement("div");
  tabsContainer.className =
    "flex justify-around border-b border-gray-700 mt-4 mb-4 bg-gray-900/80 backdrop-blur-sm z-40";
  contentWrapper.appendChild(tabsContainer);

  const infoTabButton = document.createElement("button");
  infoTabButton.id = "info-tab-btn";
  infoTabButton.className =
    `flex-1 py-3 text-sm font-semibold border-b-2 ${isPurpleTheme ? 'border-purple-adult text-purple-adult' : 'border-orange-500 text-orange-500'} focus:outline-none transition-colors duration-200`;
  infoTabButton.textContent = "Info";
  tabsContainer.appendChild(infoTabButton);

  const castTabButton = document.createElement("button");
  castTabButton.id = "cast-tab-btn";
  castTabButton.className =
    "flex-1 py-3 text-sm font-semibold text-gray-400 border-b-2 border-transparent hover:text-white hover:border-gray-500 focus:outline-none transition-colors duration-200";
  castTabButton.textContent = "Reparto";
  tabsContainer.appendChild(castTabButton);

  const commentsTabButton = document.createElement("button");
  commentsTabButton.id = "comments-tab-btn";
  commentsTabButton.className =
    "flex-1 py-3 text-sm font-semibold text-gray-400 border-b-2 border-transparent hover:text-white hover:border-gray-500 focus:outline-none transition-colors duration-200";
  commentsTabButton.textContent = "Comentarios";
  tabsContainer.appendChild(commentsTabButton);

  const tabContentContainer = document.createElement("div");
  tabContentContainer.className = "flex-grow overflow-y-auto pb-20"; // Added padding-bottom for nav bar
  contentWrapper.appendChild(tabContentContainer);

  // Seasons and Episodes Section (only visible if localEpisodesDb has data for this mediaId)
  if (
    localEpisodesDb[mediaIdStr] &&
    Object.keys(localEpisodesDb[mediaIdStr]).length > 0
  ) {
    const seasonsEpisodesContent = document.createElement("div");
    seasonsEpisodesContent.id = "seasons-episodes-content";
    seasonsEpisodesContent.className = "pt-4 mt-4 border-t border-gray-700"; // Always visible, added top margin and border
    contentWrapper.appendChild(seasonsEpisodesContent);

    // Placeholder for fetching seasons and episodes
    seasonsEpisodesContent.innerHTML = `
      <h3 class="text-xl font-bold mb-4">Temporadas</h3>
      <div class="mb-4 flex items-center space-x-2">
        <select id="season-select" class="bg-gray-800 text-white p-2 rounded-lg flex-grow">
          <!-- Options will be loaded here -->
        </select>
        <div class="relative">
          <button id="sort-button" class="bg-gray-800 text-white p-2 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
            <i class="fas fa-sort mr-2"></i> Ordenar
          </button>
          <div id="sort-options" class="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg hidden z-10">
            <button class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700" data-sort-order="asc">Más antiguo</button>
            <button class="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700" data-sort-order="desc">Más nuevo</button>
          </div>
        </div>
      </div>
      <div id="episodes-list" class="space-y-4">
        <!-- Episodes will be loaded here -->
      </div>
    `;

    const seasonSelect = seasonsEpisodesContent.querySelector("#season-select");
    const sortButton = seasonsEpisodesContent.querySelector("#sort-button");
    const sortOptions = seasonsEpisodesContent.querySelector("#sort-options");
    const episodesList = seasonsEpisodesContent.querySelector("#episodes-list");

    let currentSortOrder = "asc"; // Default to "más antiguo"

    // Populate season select based on localEpisodesDb
    const availableSeasons = Object.keys(localEpisodesDb[mediaIdStr]).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );
    availableSeasons.forEach((sNum) => {
      const option = document.createElement("option");
      option.value = sNum;
      option.textContent =
        sNum === "0" ? "Especiales" : `Temporada ${sNum}`; // Label "Season 0" as "Especiales"
      seasonSelect.appendChild(option);
    });

    // Function to load episodes for a selected season
    const loadEpisodes = async (selectedSeasonNumber, sortOrder = currentSortOrder) => {
      episodesList.innerHTML =
        "<p class='text-center text-gray-400'>Cargando episodios...</p>";
      let episodesToDisplay = [];

      console.log("loadEpisodes called for season:", selectedSeasonNumber, "sort order:", sortOrder);
      console.log("localEpisodesDb for mediaId:", localEpisodesDb[mediaIdStr]);

      // Get local episode stubs for the selected season
      const localEpisodeStubs =
        localEpisodesDb[mediaIdStr] &&
        localEpisodesDb[mediaIdStr][selectedSeasonNumber]
          ? localEpisodesDb[mediaIdStr][selectedSeasonNumber]
          : [];

      if (localEpisodeStubs.length > 0) {
        // Fetch full details for each local episode stub from TMDB
        const episodePromises = localEpisodeStubs.map(async (localEp) => {
          const fullEpisodeDetails = await fetchEpisodeDetails(
            apiBaseUrl,
            movie.id,
            selectedSeasonNumber,
            localEp.episode_number
          );

          console.log(
            `Details for S${selectedSeasonNumber}E${localEp.episode_number}: Local Stub:`,
            localEp,
            "TMDB Details:",
            fullEpisodeDetails
          );

          // Merge local stub with TMDB details if available, otherwise use local stub with defaults
          return fullEpisodeDetails
            ? {
                ...fullEpisodeDetails,
                url: localEp.url, // Prioritize local URL
                overview:
                  fullEpisodeDetails.overview || "Sin sinopsis disponible.",
                name:
                  fullEpisodeDetails.name ||
                  `Episodio ${fullEpisodeDetails.episode_number}`,
                runtime: fullEpisodeDetails.runtime || "N/A",
                still_path: fullEpisodeDetails.still_path || null,
              }
            : {
                // If no TMDB data, use local stub with defaults
                id: `${movie.id}-${selectedSeasonNumber}-${localEp.episode_number}`, // Generate a unique ID for local-only episodes
                episode_number: localEp.episode_number,
                name: `Episodio ${localEp.episode_number}`,
                overview: "Sin sinopsis disponible.",
                runtime: "N/A",
                still_path: null, // Placeholder for image
                url: localEp.url,
              };
        });
        episodesToDisplay = await Promise.all(episodePromises);

        // Apply sorting based on sortOrder
        episodesToDisplay.sort((a, b) => {
          if (sortOrder === "asc") {
            return a.episode_number - b.episode_number;
          } else {
            return b.episode_number - a.episode_number;
          }
        });

        console.log(
          "Episodes to display (from local DB, merged with TMDB data, sorted):",
          episodesToDisplay
        );
      } else {
        episodesToDisplay = []; // No local stubs, so no episodes to display
        console.log("No local episode stubs found for this season.");
      }
      episodesList.innerHTML = ""; // Clear loading message
      if (episodesToDisplay && episodesToDisplay.length > 0) {
        episodesToDisplay.forEach((episode) => {
          const episodeCard = document.createElement("div");
          episodeCard.className =
            "flex items-center bg-gray-800 rounded-lg overflow-hidden shadow-md relative";
          episodeCard.innerHTML = `
            <div class="relative w-24 h-auto flex-shrink-0">
              <img src="${imageBaseUrl}${
            episode.still_path || movie.backdrop_path || movie.poster_path
          }" alt="${
            episode.name
          }" class="w-full h-full object-cover rounded-l-lg">
              <a href="${
                episode.url ||
                `go:?mediaType=${mediaType}&mediaId=${movie.id}&seasonNumber=${selectedSeasonNumber}&episodeNumber=${episode.episode_number}`
              }" class="episode-play-link absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity duration-200 rounded-l-lg"
              data-media-id="${movie.id}"
              data-season-number="${selectedSeasonNumber}"
              data-episode-number="${episode.episode_number}">
                <i class="fas fa-play text-white text-2xl"></i>
              </a>
            </div>
            <div class="p-3 flex-grow">
              <h4 class="font-bold text-base mb-1">
                ${episode.episode_type === "special" ? '<span class="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full mr-2">Especial</span>' : ''}
                E${episode.episode_number}: ${episode.name}
              </h4>
              <p class="text-gray-400 text-sm mb-2 line-clamp-2">${
                episode.overview
              }</p>
              <div class="flex items-center text-gray-500 text-xs">
                <i class="far fa-clock mr-1"></i>
                <span>${episode.runtime} min</span>
              </div>
              <button class="mark-watched-btn mt-2 text-xs px-2 py-1 rounded-full transition-colors duration-200" data-episode-id="${
                episode.id
              }" data-media-id="${
            movie.id
          }" data-season-number="${selectedSeasonNumber}" data-episode-number="${
            episode.episode_number
          }">
                <i class="far fa-eye mr-1"></i> Marcar como visto
              </button>
            </div>
          `;
          episodesList.appendChild(episodeCard);

          // Add event listener for the mark-watched button
            const markWatchedBtn = episodeCard.querySelector(".mark-watched-btn");
            updateWatchedButtonState(markWatchedBtn); // Set initial state

            markWatchedBtn.addEventListener("click", (event) => {
              event.stopPropagation(); // Prevent navigation from the episode card if it were a link
              toggleEpisodeWatched(markWatchedBtn);
            });

            // Add event listener for the episode play link
            const episodePlayLink = episodeCard.querySelector(".episode-play-link");
            episodePlayLink.addEventListener("click", (event) => {
              event.preventDefault(); // Prevent default navigation

              const mediaId = episodePlayLink.dataset.mediaId;
              const seasonNumber = episodePlayLink.dataset.seasonNumber;
              const episodeNumber = episodePlayLink.dataset.episodeNumber;

              // Only mark as watched if autoViewEnabled is true
              if (isAutoViewEnabled()) {
                markEpisodeAsWatched(mediaId, seasonNumber, episodeNumber);
              }

              // Now navigate to the episode URL
              window.location.href = episodePlayLink.href;
            });
        });
      } else {
        episodesList.innerHTML =
          "<p class='text-center text-gray-400'>No se encontraron episodios para esta temporada.</p>";
      }
    };

    seasonSelect.addEventListener("change", (event) => {
      loadEpisodes(event.target.value, currentSortOrder);
    });

    // Event listeners for sort button and options
    sortButton.addEventListener("click", () => {
      sortOptions.classList.toggle("hidden");
    });

    sortOptions.querySelectorAll("button").forEach(option => {
      option.addEventListener("click", (event) => {
        currentSortOrder = event.target.dataset.sortOrder;
        sortOptions.classList.add("hidden");
        loadEpisodes(seasonSelect.value, currentSortOrder);
      });
    });

    // Close sort options if clicked outside
    document.addEventListener("click", (event) => {
      if (!sortButton.contains(event.target) && !sortOptions.contains(event.target)) {
        sortOptions.classList.add("hidden");
      }
    });

    // Load episodes for the initially selected season (or the first available local season)
    const initialSeason =
      seasonNumber ||
      (localEpisodesDb[mediaIdStr]
        ? Object.keys(localEpisodesDb[mediaIdStr]).sort(
            (a, b) => parseInt(a) - parseInt(b)
          )[0]
        : null); // Changed default to null if no local seasons
    if (initialSeason) {
      seasonSelect.value = initialSeason;
      loadEpisodes(initialSeason, currentSortOrder);
    }
  }
  // Info Tab Content
  const infoContent = document.createElement("div");
  infoContent.id = "info-content";
  infoContent.className = "tab-content pt-4"; // Added padding-top
  tabContentContainer.appendChild(infoContent);

  // Synopsis - Moved inside infoContent with read more/less functionality
  const synopsisContainer = document.createElement("div");
  synopsisContainer.className = "mb-4";
  infoContent.appendChild(synopsisContainer);

  const synopsisText = document.createElement("p");
  synopsisText.className = "text-sm md:text-base";
  synopsisContainer.appendChild(synopsisText);

  const fullSynopsis = movie.overview;
  const truncateLength = 150; // Characters
  let isTruncated = fullSynopsis.length > truncateLength;

  const updateSynopsisDisplay = () => {
    if (isTruncated) {
      synopsisText.textContent =
        fullSynopsis.substring(0, truncateLength) + "...";
      readMoreButton.textContent = "Leer más";
    } else {
      synopsisText.textContent = fullSynopsis;
      readMoreButton.textContent = "Leer menos";
    }
  };

  const readMoreButton = document.createElement("button");
  readMoreButton.className =
    `${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'} hover:underline text-sm mt-1 focus:outline-none`;
  readMoreButton.addEventListener("click", () => {
    isTruncated = !isTruncated;
    updateSynopsisDisplay();
  });

  if (fullSynopsis.length > truncateLength) {
    synopsisContainer.appendChild(readMoreButton);
  }
  updateSynopsisDisplay();

  // Cast Tab Content
  const castContent = document.createElement("div");
  castContent.id = "cast-content";
  castContent.className = "tab-content hidden pt-4"; // Hidden by default, added padding-top
  tabContentContainer.appendChild(castContent);

  // Comments Tab Content
  const commentsContent = document.createElement("div");
  commentsContent.id = "comments-content";
  commentsContent.className = "tab-content hidden pt-4"; // Hidden by default, added padding-top

  // Construct a canonical URL for the Facebook comments plugin
  const canonicalBaseUrl = "https://yamilat.app"; // A stable, canonical URL for your site
  const commentsUrl = `${canonicalBaseUrl}/${mediaType}/${mediaId}`;

  commentsContent.innerHTML = `
    <div class="fb-comments" data-href="${commentsUrl}" data-width="100%" data-numposts="5"></div>
  `;
  tabContentContainer.appendChild(commentsContent);

  // Tab Switching Logic
  infoTabButton.addEventListener("click", () => {
    infoTabButton.classList.add(`${isPurpleTheme ? 'border-purple-adult' : 'border-orange-500'}`, `${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'}`);
    infoTabButton.classList.remove(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    castTabButton.classList.remove(`${isPurpleTheme ? 'border-purple-adult' : 'border-orange-500'}`, `${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'}`);
    castTabButton.classList.add(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    commentsTabButton.classList.remove(`${isPurpleTheme ? 'border-purple-adult' : 'border-orange-500'}`, `${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'}`);
    commentsTabButton.classList.add(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    infoContent.classList.remove("hidden");
    castContent.classList.add("hidden");
    commentsContent.classList.add("hidden");
    tabContentContainer.classList.remove("hidden"); // Show the main tab content container
  });

  castTabButton.addEventListener("click", async () => {
    castTabButton.classList.add(`${isPurpleTheme ? 'border-purple-adult' : 'border-orange-500'}`, `${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'}`);
    castTabButton.classList.remove(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    infoTabButton.classList.remove(`${isPurpleTheme ? 'border-purple-adult' : 'border-orange-500'}`, `${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'}`);
    infoTabButton.classList.add(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    commentsTabButton.classList.remove(`${isPurpleTheme ? 'border-purple-adult' : 'border-orange-500'}`, `${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'}`);
    commentsTabButton.classList.add(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    castContent.classList.remove("hidden");
    infoContent.classList.add("hidden");
    commentsContent.classList.add("hidden");
    tabContentContainer.classList.remove("hidden"); // Show the main tab content container

    // Fetch and display cast only once
    if (castContent.children.length === 0) {
      const cast = await fetchCast(
        apiBaseUrl,
        mediaType,
        mediaId,
        seasonNumber,
        episodeNumber
      );
      if (cast && cast.length > 0) {
        const castSlider = document.createElement("div");
        castSlider.className =
          "flex overflow-x-auto space-x-4 pb-4 slider-container"; // Horizontal slider
        cast.slice(0, 10).forEach((actor) => {
          // Limit to 10 cast members for slider
          const actorCard = document.createElement("div");
          actorCard.className =
            "flex-shrink-0 w-24 flex flex-col items-center text-center"; // Fixed width for slider items
          if (actor.profile_path) {
            const actorImage = document.createElement("img");
            actorImage.src = `${imageBaseUrl}${actor.profile_path}`;
            actorImage.alt = actor.name;
            actorImage.className = "w-20 h-20 rounded-full object-cover mb-2";
            actorCard.appendChild(actorImage);
          } else {
            const placeholder = document.createElement("div");
            placeholder.className =
              "w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-2";
            placeholder.innerHTML =
              '<i class="fas fa-user text-2xl text-gray-400"></i>';
            actorCard.appendChild(placeholder);
          }
          const actorName = document.createElement("p");
          actorName.className = "text-sm font-semibold truncate w-full"; // Truncate long names
          actorName.textContent = actor.name;
          actorCard.appendChild(actorName);
          const characterName = document.createElement("p");
          characterName.className = "text-xs text-gray-400 truncate w-full"; // Truncate long characters
          characterName.textContent = actor.character;
          actorCard.appendChild(characterName);
          castSlider.appendChild(actorCard);
        });
        castContent.appendChild(castSlider);
      } else {
        castContent.innerHTML =
          "<p class='text-center text-gray-400'>No se encontró información del reparto.</p>";
      }
    }
  });

  commentsTabButton.addEventListener("click", () => {
    commentsTabButton.classList.add(`${isPurpleTheme ? 'border-purple-adult' : 'border-orange-500'}`, `${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'}`);
    commentsTabButton.classList.remove(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    infoTabButton.classList.remove(`${isPurpleTheme ? 'border-purple-adult' : 'border-orange-500'}`, `${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'}`);
    infoTabButton.classList.add(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    castTabButton.classList.remove(`${isPurpleTheme ? 'border-purple-adult' : 'border-orange-500'}`, `${isPurpleTheme ? 'text-purple-adult' : 'text-orange-500'}`);
    castTabButton.classList.add(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    commentsContent.classList.remove("hidden");
    infoContent.classList.add("hidden");
    castContent.classList.add("hidden");
    tabContentContainer.classList.remove("hidden"); // Show the main tab content container

    // Parse the Facebook comments plugin after it's made visible
    if (typeof FB !== "undefined" && FB.XFBML) {
      setTimeout(() => {
        FB.XFBML.parse(commentsContent);
      }, 100); // Small delay to ensure rendering
    }
  });

  movieDetailContainer.appendChild(contentWrapper);

  movieDetailContainer.appendChild(contentWrapper);

  // Trailer Modal Structure
  const trailerModal = document.createElement("div");
  trailerModal.id = "trailer-modal";
  trailerModal.className =
    "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] hidden"; // Hidden by default, high z-index
  trailerModal.innerHTML = `
    <div class="relative w-11/12 max-w-3xl aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
      <button id="close-trailer-modal" class="absolute top-3 right-3 text-white text-2xl z-10">
        <i class="fas fa-times-circle"></i>
      </button>
      <div id="trailer-iframe-container" class="w-full h-full">
        <!-- Trailer iframe will be loaded here -->
      </div>
    </div>
  `;
  movieDetailContainer.appendChild(trailerModal);

  // Event listener for trailer button
  if (trailer) {
    console.log("Trailer found. Making trailer button visible.");
    trailerButton.style.display = "flex"; // Ensure it's visible if a trailer exists
    trailerButton.addEventListener("click", () => {
      const trailerIframeContainer = trailerModal.querySelector(
        "#trailer-iframe-container"
      );
      trailerIframeContainer.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${trailer.key}?autoplay=1"
          allow="autoplay"
          allowfullscreen
          class="w-full h-full"
        ></iframe>
      `;
      trailerModal.classList.remove("hidden");
    });
  } else {
    console.log("No trailer found. Hiding trailer button.");
    trailerButton.style.display = "none"; // Hide button if no trailer
  }

  // Event listener for closing the modal
  trailerModal
    .querySelector("#close-trailer-modal")
    .addEventListener("click", () => {
      trailerModal.classList.add("hidden");
      trailerModal.querySelector("#trailer-iframe-container").innerHTML = ""; // Stop video playback
    });

  updateYamiprogress(mediaIdStr, localEpisodesDb); // Initial update of Yamiprogress when the page loads
  console.log("Returning movieDetailContainer:", movieDetailContainer);
  return movieDetailContainer;
}
