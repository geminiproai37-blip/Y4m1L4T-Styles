// --- CONFIGURACIÓN IMPORTANTE ---
// Clave de API de The Movie Database (TMDB)
const tmdbApiKey = "b619bab44d405bb6c49b14dfc7365b51";

// App ID de Facebook (para comentarios)
const fbAppId = "1320266426121861"; // Using the one from series/config.js as it has a value

// Token de tu Bot de Telegram (para reportes)
const telegramBotToken = "7501592844:AAFR8K1wZEdie8g8F4FY3rVtKyM3EEZ8xg0"; // Using the one from buscador/config.js

// ID del Chat o Canal de Telegram (para reportes)
const telegramChatId = "-1003012512019"; // Using the one from buscador/config.js

// OPCIONAL: ID del Tópico de Telegram si es un grupo (para reportes)
const telegramTopicId = "3"; // Using the one from buscador/config.js

function buildGlobalHeader(
  logoText = "Yami",
  logoSpanText = "Lat",
  logoSpanColorClass = "text-orange-500",
  iconHtml = `
    <svg
      class="h-7 w-7 md:h-8 md:w-8 text-orange-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9a2.25 2.25 0 0 0-2.25 2.25v9A2.25 2.25 0 0 0 4.5 18.75Z"
      />
    </svg>
  `,
  iconColorClass = "text-orange-500"
) {
  const header = document.createElement("header");
  header.className =
    "bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 py-4 px-5 flex justify-between items-center border-b border-gray-800";

  header.innerHTML = `
          <div class="flex items-center">
            ${iconHtml}
            <h1 class="text-xl md:text-2xl font-bold text-white ml-1">
              ${logoText}<span class="${logoSpanColorClass}">${logoSpanText}</span>
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <a href="http://action_noads" id="premium-btn" aria-label="Premium" class="text-orange-500 hover:text-orange-300 transition flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700">
              <i class="fas fa-crown text-lg md:text-xl"></i>
            </a>
            <a href="http://action_notifications" id="notification-btn" aria-label="Notificaciones" class="text-gray-400 hover:text-white transition">
              <i class="fas fa-bell text-lg md:text-xl"></i>
            </a>
            <a href="http://action_share" id="share-btn" aria-label="Compartir" class="text-gray-400 hover:text-white transition">
              <i class="fas fa-share-alt text-lg md:text-xl"></i>
            </a>
            <a href="#buscador" aria-label="Buscar" class="text-gray-400 hover:text-white transition">
              <i class="fas fa-search text-lg md:text-xl"></i>
            </a>
          </div>
        `;

  return header;
}

import { loadAdultContentSection, globalAdultMediaDetails } from "./adultContent.js"; // Import the new function and globalAdultMediaDetails
import { initializeFavoritesPage, renderFavorites, createEmptyStateMessage } from "./favoritos.js";
import { initBuscador } from "./buscador.js";
import { favoritosTemplate } from "./templates/favoritosTemplate.js";

function buildGlobalNavigationBar() {
  const nav = document.createElement("nav");
  nav.className =
    "fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 flex justify-around p-2 z-50";

  let navLinksHtml = `
          <a href="#home" aria-label="Inicio" data-section="home"
            class="nav-link flex flex-col items-center text-gray-400 hover:text-orange-500 w-1/4 py-1 rounded-lg transition">
            <i class="fas fa-home text-lg md:text-xl mb-1"></i>
            <span class="text-xs font-semibold">Inicio</span>
          </a>
          <a href="#explorar" aria-label="Explorar" data-section="explorar"
            class="nav-link flex flex-col items-center text-gray-400 hover:text-orange-500 w-1/4 py-1 rounded-lg transition">
            <i class="fas fa-compass text-lg md:text-xl mb-1"></i>
            <span class="text-xs font-semibold">Explorar</span>
          </a>
          <a href="#favoritos" aria-label="Favoritos" data-section="favoritos" id="nav-link-favoritos"
            class="nav-link flex flex-col items-center text-gray-400 hover:text-orange-500 w-1/4 py-1 rounded-lg transition">
            <i class="fas fa-heart text-lg md:text-xl mb-1"></i>
            <span class="text-xs font-semibold">Favoritos</span>
          </a>
        `;

  // Conditionally add +18 content link
  const isAdultContentEnabled =
    localStorage.getItem("adultContentEnabled") === "true";
  if (isAdultContentEnabled) {
    navLinksHtml += `
          <a href="#adult-content" aria-label="Contenido +18" data-section="adult-content"
            class="nav-link flex flex-col items-center text-gray-400 hover:text-red-500 w-1/4 py-1 rounded-lg transition">
            <i class="fas fa-fire text-lg md:text-xl mb-1"></i>
            <span class="text-xs font-semibold">+18</span>
          </a>
        `;
  }

  navLinksHtml += `
          <a href="#configuracion" aria-label="Configuración" data-section="configuracion"
            class="nav-link flex flex-col items-center text-gray-400 hover:text-orange-500 w-1/4 py-1 rounded-lg transition">
            <i class="fas fa-cog text-lg md:text-xl mb-1"></i>
            <span class="text-xs font-semibold">Configuración</span>
          </a>
        `;

  nav.innerHTML = navLinksHtml;
  return nav;
}

function setActiveNavLink(currentHash) {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("text-orange-500", "bg-gray-800", "adult-active"); // Remove all potential active classes, including adult-active
    link.classList.add("text-gray-400"); // Reset to default inactive color
    // No need to reset icon for adult content, as it will always be fire
  });

  let sectionName = "home"; // Default to home
  if (currentHash) {
    const parts = currentHash.split("/");
    sectionName = parts[0];
  }

  // Special handling for detail pages that should activate their parent section
  if (sectionName === "series" && currentHash.includes("/")) {
    sectionName = "series"; // Keep as series for detail pages
  } else if (sectionName === "peliculas" && currentHash.includes("/")) {
    sectionName = "peliculas"; // Keep as peliculas for detail pages
  } else if (sectionName === "buscador") {
    // Buscador doesn't have a direct nav link in the bottom bar
    // This section is intentionally left without an active link in the bottom nav
  }

  let activeLink;
  if (sectionName === "favoritos") {
    activeLink = document.getElementById("nav-link-favoritos");
  } else {
    activeLink = document.querySelector(
      `.nav-link[data-section="${sectionName}"]`
    );
  }

  if (activeLink) {
    if (sectionName === "adult-content") {
      activeLink.classList.add("adult-active"); // Apply unique style for +18
      activeLink.classList.remove("text-gray-400", "hover:text-red-500"); // Remove default and hover
      // No need to change icon here, as it's already set to fire in buildGlobalNavigationBar
    } else {
      activeLink.classList.add("text-orange-500", "bg-gray-800");
      activeLink.classList.remove("text-gray-400");
    }
  }
}

import { initHome } from './home.js';

function buildPeliculasMainContent() {
  const main = document.createElement("main");
  main.id = "main-content";
  main.className = "pb-20";
  main.innerHTML = document.getElementById("peliculas-template").innerHTML;
  return main;
}

function buildSeriesMainContent() {
  const main = document.createElement("main");
  main.id = "main-content";
  main.className = "";
  main.innerHTML = document.getElementById("series-template").innerHTML;
  return main;
}

function buildBuscadorPageStructure() {
  const main = document.createElement("main");
  main.id = "main-content";
  main.className = "container mx-auto px-4"; // Adjusted to match the template's main, removed top padding
  main.innerHTML = document.getElementById("buscador-template").innerHTML;

  // Event listeners for buscador specific elements
  const backButton = main.querySelector("#back-button");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.history.back();
    });
  }

  return main;
}

export function createHeroSlider(backdropBaseUrl, items) {
  const sliderContainer = document.createElement("div");
  sliderContainer.className =
    "flex overflow-x-auto snap-x snap-mandatory scroll-smooth hero-slider-container relative";

  let currentSlideIndex = 0;
  const totalSlides = items.length;

  const showSlide = (index) => {
    sliderContainer.scrollTo({
      left: index * sliderContainer.offsetWidth,
      behavior: "smooth",
    });
    updateDots(index);
  };

  const nextSlide = () => {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    showSlide(currentSlideIndex);
  };

  let slideInterval = setInterval(nextSlide, 5000);

  sliderContainer.addEventListener("mouseenter", () =>
    clearInterval(slideInterval)
  );
  sliderContainer.addEventListener("mouseleave", () => {
    slideInterval = setInterval(nextSlide, 5000);
  });

  // Update active dot on manual scroll
  sliderContainer.addEventListener("scroll", () => {
    const scrollLeft = sliderContainer.scrollLeft;
    const slideWidth = sliderContainer.offsetWidth;
    const newIndex = Math.round(scrollLeft / slideWidth);
    if (newIndex !== currentSlideIndex) {
      currentSlideIndex = newIndex;
      updateDots(currentSlideIndex);
      clearInterval(slideInterval); // Stop auto-slide on manual scroll
      slideInterval = setInterval(nextSlide, 5000); // Restart auto-slide after a brief pause
    }
  });

  items.forEach((item, index) => {
    if (item && item.poster_path) {
      const slide = document.createElement("div");
      slide.className =
        "flex-shrink-0 w-full snap-center hero-slider-item relative cooca-slider-item"; /* Added cooca-slider-item */
      slide.dataset.slideIndex = index;
      slide.style.cursor = "pointer";
      slide.addEventListener("click", (event) => {
        if (!event.target.closest(".hero-button")) {
          const customUrl = `go:${item.id}`;
          window.open(customUrl, "_self");
        }
      });

      if (item.backdrop_path) {
        slide.style.backgroundImage = `url(${backdropBaseUrl}${item.backdrop_path})`;
        slide.style.backgroundSize = "cover";
        slide.style.backgroundPosition = "center";
        slide.style.backgroundRepeat = "no-repeat";
        slide.classList.add("bg-lightning"); // Add the lightning background class
      }

      const gradientOverlay = document.createElement("div");
      gradientOverlay.className = "gradient-overlay";

      const contentContainer = document.createElement("div");
      contentContainer.className = "hero-content-container";

      const topContent = document.createElement("div");
      topContent.className = "flex flex-col";

      if (item.logo_path) {
        const logo = document.createElement("img");
        logo.src = `https://image.tmdb.org/t/p/original${item.logo_path}`;
        logo.alt = `${item.title || item.name} logo`;
        logo.className = "hero-title-logo"; /* Rely on CSS for positioning and responsiveness */
        slide.appendChild(logo);
      }

      const metadataContainer = document.createElement("div");
      metadataContainer.className = "hero-metadata";

      if (item.genres && item.genres.length > 0) {
        item.genres.slice(0, 3).forEach((genre, index) => {
          const span = document.createElement("span");
          span.textContent = genre.name;
          metadataContainer.appendChild(span);
          if (index < item.genres.slice(0, 3).length - 1) {
            const dot = document.createElement("div");
            dot.className = "dot";
            metadataContainer.appendChild(dot);
          }
        });
      }
      topContent.appendChild(metadataContainer);

      const description = document.createElement("p");
      description.className =
        "text-white text-lg mt-4 mb-6 max-w-2xl line-clamp-3";
      description.textContent = item.overview || "";

      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "hero-buttons-container";

      const playButton = document.createElement("button");
      playButton.className = "hero-button play";
      playButton.addEventListener("click", () => {
        const customUrl = `go:${item.id}`;
        window.open(customUrl, "_self");
      });
      playButton.innerHTML =
        '<i class="fas fa-play text-xl mr-3"></i> Reproducir';

      const infoButton = document.createElement("button");
      infoButton.className = "hero-button secondary-icon";
      infoButton.innerHTML =
        '<i class="fas fa-info-circle text-2xl"></i><span class="text-xs mt-1">Info</span>';
      infoButton.addEventListener("click", () => {
        const customUrl = `go:${item.id}`;
        window.open(customUrl, "_self");
      });

      const dateAndRankingContainer = document.createElement("div");
      dateAndRankingContainer.className =
        "flex flex-col items-start text-lg space-y-1";

      if (item.vote_average) {
        const ranking = document.createElement("span");
        ranking.className = "flex items-center text-lg";
        ranking.innerHTML = `<i class="fas fa-star text-yellow-400 mr-1"></i> ${item.vote_average.toFixed(
          1
        )}`;
        dateAndRankingContainer.appendChild(ranking);
      }

      buttonsContainer.append(dateAndRankingContainer, playButton, infoButton);

      contentContainer.append(topContent, description, buttonsContainer);

      slide.append(gradientOverlay, contentContainer);
      sliderContainer.appendChild(slide);
    }
  });

  const dotsContainer = document.createElement("div");
  dotsContainer.className = "hero-slider-dots";
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("span");
    dot.className = "hero-slider-dot";
    dot.addEventListener("click", () => {
      currentSlideIndex = i;
      showSlide(currentSlideIndex);
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    });
    dotsContainer.appendChild(dot);
  }

  const updateDots = (activeIndex) => {
    dotsContainer.querySelectorAll(".hero-slider-dot").forEach((dot, i) => {
      if (i === activeIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  };

  if (totalSlides > 0) {
    updateDots(currentSlideIndex);
  }

  const wrapper = document.createElement("div");
  wrapper.className = "hero-slider-wrapper relative";
  wrapper.appendChild(sliderContainer);
  wrapper.appendChild(dotsContainer);

  return wrapper;
}

export function createContentSlider(imageBaseUrl, title, items, isAdultSection = false) {
  const section = document.createElement("section");
  section.className = "mb-8 relative"; // Added relative for positioning buttons

  const h2 = document.createElement("h2");
  h2.className = `text-xl font-bold mb-4 ${isAdultSection ? 'text-adult-slider-title' : 'text-orange-500'}`;
  h2.textContent = title;
  section.appendChild(h2);

  const sliderWrapper = document.createElement("div");
  sliderWrapper.className = "relative"; // Wrapper for slider and buttons
  section.appendChild(sliderWrapper);

  const sliderContainer = document.createElement("div");
  sliderContainer.className =
    "flex overflow-x-auto space-x-3 md:space-x-4 pb-4 slider-container"; // Changed to overflow-x-auto

  const scrollLeftButton = document.createElement("button");
  scrollLeftButton.className =
    "slider-nav-button left-0 absolute top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-75 hover:bg-opacity-100 text-white p-2 rounded-full z-10 hidden md:block";
  scrollLeftButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
  sliderWrapper.appendChild(scrollLeftButton);

  const scrollRightButton = document.createElement("button");
  scrollRightButton.className =
    "slider-nav-button right-0 absolute top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-75 hover:bg-opacity-100 text-white p-2 rounded-full z-10 hidden md:block";
  scrollRightButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
  sliderWrapper.appendChild(scrollRightButton);

  items.forEach((item) => {
    if (item && (item.poster_path || item.backdrop_path)) {
      const contentCard = document.createElement("div"); // Changed to div as it will open a new window
      contentCard.style.cursor = "pointer"; // Add cursor pointer to indicate clickability
      contentCard.addEventListener("click", () => {
        const customUrl = `go:${item.id}`;
        window.open(customUrl, "_self");
      });

      let cardClasses = "flex-shrink-0 relative p-1 cooca-slider-item";
      if (title === "Últimos Capítulos") {
        cardClasses += " episode-card w-40 sm:w-48 md:w-56"; // Smaller width for episode cards, responsive
      } else {
        cardClasses += " poster-card w-24"; // Consistent width for poster cards, matching home section
      }
      contentCard.className = cardClasses;

      const posterImage = document.createElement("img");
      posterImage.src = imageBaseUrl + (item.still_path || item.poster_path);
      posterImage.alt = item.name || item.title;
      posterImage.className = "rounded-lg";
      posterImage.loading = "lazy";

      contentCard.append(posterImage);

      // Add delete button
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-poster-btn";
      deleteButton.innerHTML = '<i class="fas fa-times"></i>';
      deleteButton.title = `Eliminar ${item.title || item.name}`;
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent card click event from firing
        if (window.removeItem) {
          window.removeItem(item.id, item.type);
        }
      });
      contentCard.appendChild(deleteButton);

      const contentTitle = document.createElement("p");
      contentTitle.className = "text-sm mt-2 text-white text-center truncate w-full";
      contentTitle.textContent = item.title || item.name;
      contentCard.appendChild(contentTitle);

      // Container for badges and flags
      const overlayContainer = document.createElement("div");
      overlayContainer.className = "absolute top-2 right-2 flex flex-col items-end space-y-1";
      contentCard.appendChild(overlayContainer);

      if (item.isAdult) {
        const adultBadge = document.createElement("div");
        adultBadge.className = "adult-badge";
        adultBadge.textContent = "+18";
        overlayContainer.appendChild(adultBadge);
      }


      if (title === "Más Vistos" && item.rank) {
        const rankOverlay = document.createElement("div");
        rankOverlay.className = "rank-overlay absolute top-2 right-2"; // Adjusted position
        rankOverlay.textContent = item.rank;
        contentCard.appendChild(rankOverlay);
      }


      if (item.episode_number && item.season_number) {
        const episodeInfo = document.createElement("p");
        episodeInfo.className = "text-xs text-gray-400";
        episodeInfo.textContent = `T${item.season_number} E${item.episode_number}`;
        contentCard.appendChild(episodeInfo);
      }

      sliderContainer.appendChild(contentCard);
    }
  });

  sliderWrapper.appendChild(sliderContainer);

  // Slider navigation logic
  const scrollAmount = 200; // Adjust scroll distance as needed

  scrollLeftButton.addEventListener("click", () => {
    sliderContainer.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  scrollRightButton.addEventListener("click", () => {
    sliderContainer.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  return section;
}

export function createLatestEpisodesSlider(imageBaseUrl, title, items, titleColorClass = 'text-orange-500', isAdultSection = false) {
  const section = document.createElement("section");
  section.className = "mb-8 relative";

  const h2 = document.createElement("h2");
  h2.className = `text-lg font-bold mb-4 ${titleColorClass} whitespace-nowrap overflow-hidden text-ellipsis adult-latest-episodes-title`;
  h2.textContent = title;
  section.appendChild(h2);

  const sliderWrapper = document.createElement("div");
  sliderWrapper.className = "relative";
  section.appendChild(sliderWrapper);

  const sliderContainer = document.createElement("div");
  sliderContainer.className =
    "flex overflow-x-auto space-x-3 md:space-x-4 pb-4 slider-container snap-x snap-mandatory";
  const scrollLeftButton = document.createElement("button");
  scrollLeftButton.className =
    "slider-nav-button left-0 absolute top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-75 hover:bg-opacity-100 text-white p-2 rounded-full z-10 hidden md:block";
  scrollLeftButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
  sliderWrapper.appendChild(scrollLeftButton);

  const scrollRightButton = document.createElement("button");
  scrollRightButton.className =
    "slider-nav-button right-0 absolute top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-75 hover:bg-opacity-100 text-white p-2 rounded-full z-10 hidden md:block";
  scrollRightButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
  sliderWrapper.appendChild(scrollRightButton);

  items.forEach((item) => {
    if (item && (item.still_path || item.backdrop_path || item.poster_path)) {
      const contentCard = document.createElement("div");
      contentCard.className = "flex-shrink-0 relative p-1 latest-episode-card rounded-lg overflow-hidden bg-gray-800 shadow-lg snap-center";
      contentCard.style.cursor = "pointer";
      contentCard.addEventListener("click", () => {
        const customUrl = `go:${item.id}/season/${item.season}/episode/${item.episode}`;
        window.open(customUrl, "_self");
      });

      const imageContainer = document.createElement("div");
      imageContainer.className = "relative w-full aspect-video rounded-t-lg overflow-hidden";
      contentCard.appendChild(imageContainer);

      const episodeImage = document.createElement("img");
      episodeImage.src = imageBaseUrl + (item.still_path || item.backdrop_path || item.poster_path);
      episodeImage.alt = item.series_name || item.name || item.title;
      episodeImage.className = "w-full h-full object-cover";
      episodeImage.loading = "lazy";
      imageContainer.appendChild(episodeImage);

      // New div for the bottom border content
      const bottomInfoBar = document.createElement("div");
      bottomInfoBar.className = `absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 border-t ${isAdultSection ? 'border-purple-500' : 'border-orange-500'} p-2 flex flex-col items-start text-left`;
      bottomInfoBar.innerHTML = `
        <p class="text-white text-xs font-semibold truncate w-full">${item.series_name || item.name || 'Series Name N/A'}</p>
        <p class="text-gray-400 text-xs mt-1 truncate w-full">T${item.season} E${item.episode}: ${item.title || 'Episode Title N/A'}</p>
      `;
      contentCard.appendChild(bottomInfoBar); // Append to contentCard, not imageContainer

      // No play icon overlay on the image as per new requirement
      // No separate textContent div needed as all info is in bottomInfoBar

      sliderContainer.appendChild(contentCard);
    }
  });

  sliderWrapper.appendChild(sliderContainer);

  const scrollAmount = 236; // Width of card (220px) + md:space-x-4 (16px)

  scrollLeftButton.addEventListener("click", () => {
    sliderContainer.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  scrollRightButton.addEventListener("click", () => {
    sliderContainer.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  return section;
}

export function createContinueWatchingSlider(imageBaseUrl, title, items, isAdultSection = false) {
  const section = document.createElement("section");
  section.className = "mb-8 relative"; // Added relative for positioning buttons

  const h2 = document.createElement("h2");
  h2.className = `text-xl font-bold mb-4 ${isAdultSection ? 'text-white' : 'text-orange-500'}`;
  h2.textContent = title;
  section.appendChild(h2);

  const sliderWrapper = document.createElement("div");
  sliderWrapper.className = "relative"; // Wrapper for slider and buttons
  section.appendChild(sliderWrapper);

  const sliderContainer = document.createElement("div");
  sliderContainer.className =
    "flex overflow-x-auto space-x-3 md:space-x-4 pb-4 slider-container latest-episodes-slider-container";

  const scrollLeftButton = document.createElement("button");
  scrollLeftButton.className =
    "slider-nav-button left-0 absolute top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-75 hover:bg-opacity-100 text-white p-2 rounded-full z-10 hidden md:block";
  scrollLeftButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
  sliderWrapper.appendChild(scrollLeftButton);

  const scrollRightButton = document.createElement("button");
  scrollRightButton.className =
    "slider-nav-button right-0 absolute top-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-75 hover:bg-opacity-100 text-white p-2 rounded-full z-10 hidden md:block";
  scrollRightButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
  sliderWrapper.appendChild(scrollRightButton);

  items.forEach((item) => {
    if (item && (item.poster_path || item.backdrop_path)) {
      const contentCard = document.createElement("div");
      contentCard.className = "flex-shrink-0 relative p-1 continue-watching-card w-40 sm:w-48 md:w-56 rounded-lg overflow-hidden bg-gray-800 shadow-lg"; // Adjusted width to be less tall and more wide
      contentCard.style.cursor = "pointer";
      contentCard.addEventListener("click", () => {
        if (item.url) {
          window.open(item.url, "_self");
        } else {
          const customUrl = `#${item.type}/${item.id}`;
          window.location.hash = customUrl;
        }
      });

      const imageContainer = document.createElement("div");
      imageContainer.className = "relative w-full aspect-video rounded-t-lg overflow-hidden"; // Aspect ratio for thumbnail
      contentCard.appendChild(imageContainer);

      const posterImage = document.createElement("img");
      posterImage.src = imageBaseUrl + (item.still_path || item.backdrop_path || item.poster_path); // Prioritize still_path
      posterImage.alt = item.series_name || item.title || item.name;
      posterImage.className = "w-full h-full object-cover";
      posterImage.loading = "lazy";
      imageContainer.appendChild(posterImage);

      // Play icon overlay on image
      const playIconOverlay = document.createElement("div");
      playIconOverlay.className = "absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity duration-200 z-10";
      playIconOverlay.innerHTML = '<i class="fas fa-play text-white text-3xl"></i>';
      imageContainer.appendChild(playIconOverlay);

      // Delete button
      const deleteButton = document.createElement("button");
      deleteButton.className = "absolute top-2 right-2 bg-red-600 text-white text-xs p-1 rounded-full flex items-center justify-center w-6 h-6 transition-colors hover:bg-red-700 z-30";
      deleteButton.innerHTML = '<i class="fas fa-times"></i>';
      deleteButton.title = "Eliminar de Continuar viendo";
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if (window.removeProgressItem) {
          window.removeProgressItem(item.id, item.type, item.series_name || item.title || item.name);
        }
      });
      imageContainer.appendChild(deleteButton); // Attach to imageContainer for better layering

      const textContent = document.createElement("div");
      textContent.className = "p-3 flex flex-col justify-between flex-grow";
      contentCard.appendChild(textContent);

      // Series Name
      const seriesName = document.createElement("p");
      seriesName.className = "text-white text-sm font-semibold truncate mb-1";
      seriesName.textContent = item.series_name || item.name || item.title;
      textContent.appendChild(seriesName);

      // Episode Info
      if (item.seasonNumber && item.episodeNumber) {
        const episodeInfo = document.createElement("p");
        episodeInfo.className = "text-gray-400 text-sm mb-2";
        episodeInfo.textContent = `T${item.seasonNumber} E${item.episodeNumber}: ${item.title}`; // item.title is episode name
        textContent.appendChild(episodeInfo);
      }

      // Progress bar and text
      if (item.progress && typeof item.progress === 'object' && item.progress.percentage !== undefined) {
        const progressBarContainer = document.createElement("div");
        progressBarContainer.className = "w-full bg-gray-700 rounded-full h-2.5 relative mt-auto"; // Adjusted for better placement

        const progressBar = document.createElement("div");
        progressBar.className = `h-2.5 ${isAdultSection ? 'bg-purple-600' : 'bg-orange-500'} rounded-full transition-all duration-300 ease-out`;
        progressBar.style.width = `${item.progress.percentage}%`;
        progressBarContainer.appendChild(progressBar);

        const progressText = document.createElement("span");
        progressText.className = "absolute inset-0 flex items-center justify-center text-white text-xs font-bold";
        progressText.style.textShadow = "0 0 3px rgba(0,0,0,0.8)"; // Add text shadow for readability

        if (item.progress.watchedEpisodes !== undefined && item.progress.totalEpisodes !== undefined && item.progress.totalEpisodes > 0) {
          progressText.textContent = `${item.progress.watchedEpisodes}/${item.progress.totalEpisodes} episodios - ${Math.round(item.progress.percentage)}% completado`;
        } else {
          progressText.textContent = `${Math.round(item.progress.percentage)}% completado`;
        }
        progressBarContainer.appendChild(progressText);
        textContent.appendChild(progressBarContainer);
      }

      sliderContainer.appendChild(contentCard);
    }
  });

  sliderWrapper.appendChild(sliderContainer);

  // Slider navigation logic
  const scrollAmount = 200; // Adjust scroll distance as needed

  scrollLeftButton.addEventListener("click", () => {
    sliderContainer.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  scrollRightButton.addEventListener("click", () => {
    sliderContainer.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  return section;
}

export function createRankedSlider(imageBaseUrl, title, items) {
  const section = document.createElement("section");
  section.className = "mb-8 relative";

  const h2 = document.createElement("h2");
  h2.className = "text-xl font-bold mb-4 text-orange-500";
  h2.textContent = title;
  section.appendChild(h2);

  const sliderWrapper = document.createElement("div");
  sliderWrapper.className = "relative";
  section.appendChild(sliderWrapper);

  const sliderContainer = document.createElement("div");
  sliderContainer.className = "flex overflow-x-auto space-x-3 md:space-x-4 pb-4 slider-container";

  items.forEach((item, index) => {
    if (item && item.poster_path) {
      const rankedItem = document.createElement("div");
      rankedItem.className = "flex-shrink-0 relative p-1 ranked-item";
      rankedItem.style.cursor = "pointer";
      rankedItem.addEventListener("click", () => {
        const tmdbUrl = `https://www.themoviedb.org/${item.type}/${item.id}`;
        window.open(tmdbUrl, "_self");
      });

      const rankNumber = document.createElement("div");
      rankNumber.className = "rank-number";
      rankNumber.textContent = index + 1;
      rankedItem.appendChild(rankNumber);

      const posterImage = document.createElement("img");
      posterImage.src = imageBaseUrl + item.poster_path;
      posterImage.alt = item.name || item.title;
      posterImage.className = "rounded-lg poster-card";
      posterImage.loading = "lazy";
      rankedItem.appendChild(posterImage);

      sliderContainer.appendChild(rankedItem);
    }
  });

  sliderWrapper.appendChild(sliderContainer);

  return section;
}

function createMovieGrid(imageBaseUrl, movies) {
  const movieGrid = document.createElement("div");
  movieGrid.id = "movie-grid";
  movieGrid.className = "grid grid-cols-3 gap-4";

  movies.forEach((movie) => {
    if (movie && movie.poster_path) {
      const movieCard = document.createElement("div");
      movieCard.className =
        "flex flex-col items-center text-center cursor-pointer";
      movieCard.addEventListener("click", () => {
        const customUrl = `go:${movie.id}`;
        window.open(customUrl, "_self");
      });

      const posterImage = document.createElement("img");
      posterImage.src = imageBaseUrl + movie.poster_path;
      posterImage.alt = movie.title;
      posterImage.className = "rounded-lg w-full h-auto object-cover";
      posterImage.loading = "lazy";
      movieCard.appendChild(posterImage);

      // Add delete button
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-poster-btn movie-card"; // Added movie-card class for specific hover
      deleteButton.innerHTML = '<i class="fas fa-times"></i>';
      deleteButton.title = `Eliminar ${movie.title}`;
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent card click event from firing
        if (window.removeItem) {
          window.removeItem(movie.id, movie.type);
        }
      });
      movieCard.appendChild(deleteButton);

      // Container for badges and flags
      const overlayContainer = document.createElement("div");
      overlayContainer.className = "absolute top-2 right-2 flex flex-col items-end space-y-1";
      movieCard.appendChild(overlayContainer);

      if (movie.isAdult) {
        const adultBadge = document.createElement("div");
        adultBadge.className =
          "bg-purple-600 text-white text-xs font-bold px-1 py-0.5 rounded-md"; // Changed to purple, smaller padding, rounded-md
        adultBadge.textContent = "+18";
        overlayContainer.appendChild(adultBadge);
      }


      const movieTitle = document.createElement("p");
      movieTitle.className = "text-sm mt-2 truncate w-full";
      movieTitle.textContent = movie.title;

      movieCard.append(posterImage, movieTitle);
      movieGrid.appendChild(movieCard);
    }
  });

  return movieGrid;
}

window.createSeriesGrid = function (imageBaseUrl, series) {
  const seriesGrid = document.createElement("div");
  seriesGrid.id = "series-grid";
  seriesGrid.className = "grid grid-cols-3 gap-4";

  series.forEach((tvShow) => {
    if (tvShow && tvShow.poster_path) {
      const seriesCard = document.createElement("div"); // Changed to div
      seriesCard.className =
        "flex flex-col items-center text-center cursor-pointer rounded-lg border border-gray-700 overflow-hidden relative"; // Added 'relative' for badge positioning
      seriesCard.addEventListener("click", () => {
        const customUrl = `go:${tvShow.id}`; // Open custom URL
        window.open(customUrl, "_self");
      });

      const posterImage = document.createElement("img");
      posterImage.src = imageBaseUrl + tvShow.poster_path;
      posterImage.alt = tvShow.name;
      posterImage.className = "w-full h-auto object-cover"; // Removed rounded-lg from image, as the parent div will handle it
      posterImage.loading = "lazy";
      seriesCard.appendChild(posterImage);

      // Container for badges and flags
      const overlayContainer = document.createElement("div");
      overlayContainer.className = "absolute top-2 right-2 flex flex-col items-end space-y-1";
      seriesCard.appendChild(overlayContainer);

      if (tvShow.isAdult) {
        const adultBadge = document.createElement("div");
        adultBadge.className = "adult-badge";
        adultBadge.textContent = "+18";
        overlayContainer.appendChild(adultBadge);
      }


      const seriesTitle = document.createElement("p");
      seriesTitle.className = "text-sm mt-2 truncate w-full";
      seriesTitle.textContent = tvShow.name;
      seriesCard.appendChild(seriesTitle);

      // Add progress bar and text if progress data exists
      if (tvShow.progress && typeof tvShow.progress === 'object' && tvShow.progress.percentage !== undefined) {
        const progressBarContainer = document.createElement("div");
        progressBarContainer.className = "w-full bg-gray-700 rounded-full h-2.5 relative mt-2";

        const progressBar = document.createElement("div");
        progressBar.className = "h-2.5 bg-orange-500 rounded-full transition-all duration-300 ease-out";
        progressBar.style.width = `${tvShow.progress.percentage}%`;
        progressBarContainer.appendChild(progressBar);

        const progressText = document.createElement("span");
        progressText.className = "absolute inset-0 flex items-center justify-center text-white text-xs font-bold";
        progressText.style.textShadow = "0 0 3px rgba(0,0,0,0.8)";

        if (tvShow.progress.watchedEpisodes !== undefined && tvShow.progress.totalEpisodes !== undefined && tvShow.progress.totalEpisodes > 0) {
          progressText.textContent = `${tvShow.progress.watchedEpisodes}/${tvShow.progress.totalEpisodes} episodios - ${Math.round(tvShow.progress.percentage)}% completado`;
        } else {
          progressText.textContent = `${Math.round(tvShow.progress.percentage)}% completado`;
        }
        progressBarContainer.appendChild(progressText);
        seriesCard.appendChild(progressBarContainer);
      }

      seriesGrid.appendChild(seriesCard);
    }
  });

  return seriesGrid;
};

async function buildMovieDetailPage(
  apiBaseUrl,
  backdropBaseUrl,
  imageBaseUrl,
  mediaDetails,
  mediaType,
  mediaId,
  seasonNumber,
  episodeNumber,
  localEpisodesDb
) {
  const movie = mediaDetails;
  const mediaIdStr = String(mediaId);
  const movieDetailContainer = document.createElement("div");
  movieDetailContainer.className =
    "relative w-full min-h-screen bg-gray-900 text-white pb-20";

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "relative z-10 p-5 max-w-4xl mx-auto";
  movieDetailContainer.appendChild(contentWrapper);

  const mediaDisplayContainer = document.createElement("div");
  mediaDisplayContainer.className =
    "relative w-full aspect-video mb-4 rounded-lg overflow-hidden shadow-lg";
  contentWrapper.appendChild(mediaDisplayContainer);

  const videos = await fetchMediaVideos(apiBaseUrl, mediaType, movie.id);
  const trailer = videos.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  console.log("buildMovieDetailPage: movie.backdrop_path:", movie.backdrop_path); // Added log

  if (trailer) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}`;
    iframe.allow = "autoplay; encrypted-media";
    iframe.allowFullscreen = true;
    iframe.className = "w-full h-full";
    mediaDisplayContainer.appendChild(iframe);
  } else if (movie.backdrop_path) {
    mediaDisplayContainer.style.backgroundImage = `url(${backdropBaseUrl}${movie.backdrop_path})`;
    mediaDisplayContainer.style.backgroundSize = "cover";
    mediaDisplayContainer.style.backgroundPosition = "center";
  } else {
    mediaDisplayContainer.style.backgroundColor = "#1f2937";
    mediaDisplayContainer.innerHTML = `
            <div class="flex items-center justify-center w-full h-full text-gray-500 text-xl">
              No hay imagen disponible
            </div>
          `;
  }

  if (movie.logo_path) {
    const logo = document.createElement("img");
    logo.src = `https://image.tmdb.org/t/p/original${movie.logo_path}`;
    logo.alt = `${movie.title || movie.name} logo`;
    logo.className =
      "absolute bottom-4 left-4 max-w-[150px] h-auto drop-shadow-lg z-10";
    mediaDisplayContainer.appendChild(logo);
  }

  const titleAndGenresContainer = document.createElement("div");
  titleAndGenresContainer.className =
    "flex flex-col md:flex-row md:items-center md:justify-between mb-3";
  contentWrapper.appendChild(titleAndGenresContainer);

  if (!movie.logo_path) {
    const title = document.createElement("h1");
    title.className =
      "text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-0 drop-shadow-lg text-center";
    title.textContent = movie.title || movie.name;
    titleAndGenresContainer.appendChild(title);
  }

  const categoriesAndMetadataContainer = document.createElement("div");
  categoriesAndMetadataContainer.className =
    "flex flex-wrap gap-2 mt-2 md:mt-0 md:ml-4";

  if (movie.genres && movie.genres.length > 0) {
    movie.genres.forEach((genre) => {
      const genreSpan = document.createElement("span");
      genreSpan.className =
        "bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full";
      genreSpan.textContent = genre.name;
      categoriesAndMetadataContainer.appendChild(genreSpan);
    });
  }

  if (mediaType === "movie" && movie.release_date) {
    const movieYearSpan = document.createElement("span");
    movieYearSpan.className =
      "bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full";
    movieYearSpan.textContent = movie.release_date.substring(0, 4);
    categoriesAndMetadataContainer.appendChild(movieYearSpan);
  }

  const ageRatingSpan = document.createElement("span");
  ageRatingSpan.className =
    "bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full";
  ageRatingSpan.textContent = movie.isAdult ? "+18" : "TP";
  categoriesAndMetadataContainer.appendChild(ageRatingSpan);

  if (categoriesAndMetadataContainer.children.length > 0) {
    titleAndGenresContainer.appendChild(categoriesAndMetadataContainer);
  }

  if (localEpisodesDb[mediaIdStr]) {
    const numberOfLocalSeasons = Object.keys(
      localEpisodesDb[mediaIdStr]
    ).length;
    if (numberOfLocalSeasons > 0) {
      const seasonsContainer = document.createElement("div");
      seasonsContainer.className = "text-gray-400 text-sm mb-4 mt-2";
      const seasonsSpan = document.createElement("span");
      seasonsSpan.textContent = `${numberOfLocalSeasons} Temporada${
        numberOfLocalSeasons > 1 ? "s" : ""
      }`;
      seasonsContainer.appendChild(seasonsSpan);

      if (mediaType === "tv" && movie.first_air_date) {
        const tvYearSpan = document.createElement("span");
        tvYearSpan.className =
          "ml-2 bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full";
        tvYearSpan.textContent = movie.first_air_date.substring(0, 4);
        seasonsContainer.appendChild(tvYearSpan);
      }
      contentWrapper.appendChild(seasonsContainer);
    }
  }

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "flex flex-col gap-3 mt-4 mb-4";
  contentWrapper.appendChild(buttonsContainer);

  const playButton = document.createElement("a");
  playButton.className =
    "bg-white text-gray-900 px-6 py-3 rounded-lg font-bold flex items-center justify-center transition-colors hover:bg-gray-300 text-base";
  buttonsContainer.appendChild(playButton);

  function updatePlayButtonState(
    playButton,
    mediaType,
    mediaIdStr,
    localEpisodesDb,
    movie
  ) {
    if (mediaType !== "tv" || !localEpisodesDb[mediaIdStr]) {
      playButton.href = `#series/${movie.id}`; // Link to series detail
      playButton.innerHTML = '<i class="fas fa-play mr-2"></i> Reproducir';
      return;
    }

    const watchedEpisodes =
      JSON.parse(localStorage.getItem("watchedEpisodes")) || {};
    let nextUnwatchedEpisode = null;
    let lastWatchedEpisode = null;
    let isAnyEpisodeWatched = false;

    const availableSeasons = Object.keys(localEpisodesDb[mediaIdStr]).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    for (const sNum of availableSeasons) {
      const episodesInSeason = localEpisodesDb[mediaIdStr][sNum].sort(
        (a, b) => a.episode_number - b.episode_number
      );

      for (const episode of episodesInSeason) {
        const isWatched =
          watchedEpisodes[mediaId] &&
          watchedEpisodes[mediaId][sNum] &&
          watchedEpisodes[mediaId][sNum][episode.episode_number];

        if (isWatched) {
          isAnyEpisodeWatched = true;
          lastWatchedEpisode = {
            ...episode,
            season_number: sNum,
            name: episode.name || `Episodio ${episode.episode_number}`,
          };
        } else if (!nextUnwatchedEpisode) {
          nextUnwatchedEpisode = {
            ...episode,
            season_number: sNum,
            name: episode.name || `Episodio ${episode.episode_number}`,
          };
        }
      }
    }

    if (isAnyEpisodeWatched && lastWatchedEpisode) {
      playButton.innerHTML = `<i class="fas fa-play mr-2"></i> Continuar viendo E${lastWatchedEpisode.episode_number}: ${lastWatchedEpisode.name}`;
      playButton.href =
        lastWatchedEpisode.url ||
        `#series/${movie.id}/season/${lastWatchedEpisode.season_number}/episode/${lastWatchedEpisode.episode_number}`;
    } else {
      const firstSeason = availableSeasons[0];
      const rawFirstEpisode = localEpisodesDb[mediaIdStr][firstSeason][0];
      const firstEpisode = {
        ...rawFirstEpisode,
        name:
          rawFirstEpisode.name || `Episodio ${rawFirstEpisode.episode_number}`,
      };
      playButton.innerHTML = `<i class="fas fa-play mr-2"></i> Reproducir E${firstEpisode.episode_number}: ${firstEpisode.name}`;
      playButton.href =
        firstEpisode.url ||
        `#series/${movie.id}/season/${firstSeason}/episode/${firstEpisode.episode_number}`;
    }
  }

  function updateWatchedButtonState(button) {
    if (!button) {
      return;
    }
    if (!button.dataset) {
      return;
    }
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
  }

  function toggleEpisodeWatched(button) {
    if (!button) {
      return;
    }
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
    watchedEpisodes[mediaId][seasonNumber][episodeNumber] = !isWatched;

    localStorage.setItem("watchedEpisodes", JSON.stringify(watchedEpisodes));
    updateWatchedButtonState(button);
    updatePlayButtonState(
      playButton,
      mediaType,
      mediaIdStr,
      localEpisodesDb,
      movie
    );

    // Re-render progress sections after update
    const adultProgressSection = document.getElementById("adult-continue-watching-section");
    if (adultProgressSection) {
      window.updateProgressSection(adultProgressSection, true, globalAdultMediaDetails);
    }
    const homeProgressSection = document.getElementById("home-progress-section");
    if (homeProgressSection) {
      window.updateProgressSection(homeProgressSection, false);
    }
  }

  updatePlayButtonState(
    playButton,
    mediaType,
    mediaIdStr,
    localEpisodesDb,
    movie
  );

  // Add event listener for auto-view marking
  playButton.addEventListener("click", (event) => {
    const isAutoViewEnabled = localStorage.getItem("autoViewEnabled") === "true";
    if (isAutoViewEnabled && mediaType === "tv") {
      // Prevent default navigation
      event.preventDefault();

      // Get episode details from the playButton's href
      const href = playButton.href;
      const parts = href.split("/");
      const mediaId = parseInt(parts[parts.indexOf("series") + 1]);
      const seasonNumber = parseInt(parts[parts.indexOf("season") + 1]);
      const episodeNumber = parseInt(parts[parts.indexOf("episode") + 1]);

      // Create a dummy button element to pass to toggleEpisodeWatched
      const dummyButton = {
        dataset: {
          mediaId: mediaId,
          seasonNumber: seasonNumber,
          episodeNumber: episodeNumber,
        },
      };
      
      // Check if the episode is already watched. If not, mark it as watched.
      const watchedEpisodes = JSON.parse(localStorage.getItem("watchedEpisodes")) || {};
      const isWatched = watchedEpisodes[mediaId] && watchedEpisodes[mediaId][seasonNumber] && watchedEpisodes[mediaId][seasonNumber][episodeNumber];
      
      if (!isWatched) {
        toggleEpisodeWatched(dummyButton);
      }

      // Now navigate manually
      window.location.hash = href.substring(href.indexOf("#") + 1);
    }
  });

  const trailerButton = document.createElement("button");
  trailerButton.id = "trailer-btn";
  trailerButton.className =
    "bg-orange-500 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center transition-colors hover:bg-orange-600 text-base";
  trailerButton.innerHTML = '<i class="fas fa-film mr-2"></i> Ver Trailer';
  buttonsContainer.appendChild(trailerButton);

  const myListButton = document.createElement("button");
  myListButton.className =
    "bg-gray-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center transition-colors hover:bg-gray-600 text-base";
  buttonsContainer.appendChild(myListButton);

  const updateFavoriteButton = () => {
    let favorites = JSON.parse(localStorage.getItem("yamiLatFavorites")) || [];
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
    let favorites = JSON.parse(localStorage.getItem("yamiLatFavorites")) || [];
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
    } else {
      favorites = favorites.filter(
        (fav) => !(fav.id === movie.id && fav.type === mediaType)
      );
      localStorage.setItem("yamiLatFavorites", JSON.stringify(favorites));
    }
    updateFavoriteButton();
  });
  buttonsContainer.appendChild(myListButton);

  const tabsContainer = document.createElement("div");
  tabsContainer.className =
    "flex justify-around border-b border-gray-700 mt-4 mb-4 bg-gray-900/80 backdrop-blur-sm z-40";
  contentWrapper.appendChild(tabsContainer);

  const infoTabButton = document.createElement("button");
  infoTabButton.id = "info-tab-btn";
  infoTabButton.className =
    "flex-1 py-3 text-sm font-semibold border-b-2 border-orange-500 text-orange-500 focus:outline-none transition-colors duration-200";
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
  tabContentContainer.className = "flex-grow overflow-y-auto pb-20";
  contentWrapper.appendChild(tabContentContainer);

  if (
    localEpisodesDb[mediaIdStr] &&
    Object.keys(localEpisodesDb[mediaIdStr]).length > 0
  ) {
    const seasonsEpisodesContent = document.createElement("div");
    seasonsEpisodesContent.id = "seasons-episodes-content";
    seasonsEpisodesContent.className = "pt-4 mt-4 border-t border-gray-700";
    contentWrapper.appendChild(seasonsEpisodesContent);

    seasonsEpisodesContent.innerHTML = `
            <h3 class="text-xl font-bold mb-4">Temporadas</h3>
            <div class="mb-4">
              <select id="season-select" class="bg-gray-800 text-white p-2 rounded-lg w-full">
                <!-- Options will be loaded here -->
              </select>
            </div>
            <div id="episodes-list" class="space-y-4">
              <!-- Episodes will be loaded here -->
            </div>
          `;

    const seasonSelect = seasonsEpisodesContent.querySelector("#season-select");
    const episodesList = seasonsEpisodesContent.querySelector("#episodes-list");

    const availableSeasons = Object.keys(localEpisodesDb[mediaIdStr]).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );
    availableSeasons.forEach((sNum) => {
      const option = document.createElement("option");
      option.value = sNum;
      option.textContent = `Temporada ${sNum}`;
      seasonSelect.appendChild(option);
    });

    const loadEpisodes = async (selectedSeasonNumber) => {
      episodesList.innerHTML =
        "<p class='text-center text-gray-400'>Cargando episodios...</p>";
      let episodesToDisplay = [];

      const localEpisodeStubs =
        localEpisodesDb[mediaIdStr] &&
        localEpisodesDb[mediaIdStr][selectedSeasonNumber]
          ? localEpisodesDb[mediaIdStr][selectedSeasonNumber]
          : [];

      if (localEpisodeStubs.length > 0) {
        const episodePromises = localEpisodeStubs.map(async (localEp) => {
          const fullEpisodeDetails = await fetchEpisodeDetails(
            apiBaseUrl,
            movie.id,
            selectedSeasonNumber,
            localEp.episode_number
          );

          return fullEpisodeDetails
            ? {
                ...fullEpisodeDetails,
                url: localEp.url,
                overview:
                  fullEpisodeDetails.overview || "Sin sinopsis disponible.",
                name:
                  fullEpisodeDetails.name ||
                  `Episodio ${fullEpisodeDetails.episode_number}`,
                runtime: fullEpisodeDetails.runtime || "N/A",
                still_path: fullEpisodeDetails.still_path || null,
              }
            : {
                id: `${movie.id}-${selectedSeasonNumber}-${localEp.episode_number}`,
                episode_number: localEp.episode_number,
                name: `Episodio ${localEp.episode_number}`,
                overview: "Sin sinopsis disponible.",
                runtime: "N/A",
                still_path: null,
                url: localEp.url,
              };
        });
        episodesToDisplay = await Promise.all(episodePromises);
      } else {
        episodesToDisplay = [];
      }
      episodesList.innerHTML = "";
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
                      `#series/${movie.id}/season/${selectedSeasonNumber}/episode/${episode.episode_number}`
                    }" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity duration-200 rounded-l-lg">
                      <i class="fas fa-play text-white text-2xl"></i>
                    </a>
                  </div>
                  <div class="p-3 flex-grow">
                    <h4 class="font-bold text-base mb-1">${movie.name}</h4>
                    <p class="text-gray-400 text-sm mb-1">T${selectedSeasonNumber} E${episode.episode_number}: ${episode.name}</p>
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

          const markWatchedBtn = episodeCard.querySelector(".mark-watched-btn");
          updateWatchedButtonState(markWatchedBtn);

          markWatchedBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleEpisodeWatched(markWatchedBtn);
          });
        });
      } else {
        episodesList.innerHTML =
          "<p class='text-center text-gray-400'>No se encontraron episodios para esta temporada.</p>";
      }
    };

    seasonSelect.addEventListener("change", (event) => {
      loadEpisodes(event.target.value);
    });

    const initialSeason =
      seasonNumber ||
      (localEpisodesDb[mediaIdStr]
        ? Object.keys(localEpisodesDb[mediaIdStr]).sort(
            (a, b) => parseInt(a) - parseInt(b)
          )[0]
        : null);
    if (initialSeason) {
      seasonSelect.value = initialSeason;
      loadEpisodes(initialSeason);
    }
  }

  const infoContent = document.createElement("div");
  infoContent.id = "info-content";
  infoContent.className = "tab-content pt-4";
  tabContentContainer.appendChild(infoContent);

  const synopsisContainer = document.createElement("div");
  synopsisContainer.className = "mb-4";
  infoContent.appendChild(synopsisContainer);

  const synopsisText = document.createElement("p");
  synopsisText.className = "text-sm md:text-base";
  synopsisContainer.appendChild(synopsisText);

  const fullSynopsis = movie.overview;
  const truncateLength = 150;
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
    "text-orange-500 hover:underline text-sm mt-1 focus:outline-none";
  readMoreButton.addEventListener("click", () => {
    isTruncated = !isTruncated;
    updateSynopsisDisplay();
  });

  if (fullSynopsis.length > truncateLength) {
    synopsisContainer.appendChild(readMoreButton);
  }
  updateSynopsisDisplay();

  const castContent = document.createElement("div");
  castContent.id = "cast-content";
  castContent.className = "tab-content hidden pt-4";
  tabContentContainer.appendChild(castContent);

  const commentsContent = document.createElement("div");
  commentsContent.id = "comments-content";
  commentsContent.className = "tab-content hidden pt-4";

  const canonicalBaseUrl = "https://yamilat.app";
  const commentsUrl = `${canonicalBaseUrl}/${mediaType}/${mediaId}`;

  commentsContent.innerHTML = `
          <div class="fb-comments" data-href="${commentsUrl}" data-width="100%" data-numposts="5"></div>
        `;
  tabContentContainer.appendChild(commentsContent);

  infoTabButton.addEventListener("click", () => {
    infoTabButton.classList.add("border-orange-500", "text-orange-500");
    infoTabButton.classList.remove(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    castTabButton.classList.remove("border-orange-500", "text-orange-500");
    castTabButton.classList.add(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    commentsTabButton.classList.remove("border-orange-500", "text-orange-500");
    commentsTabButton.classList.add(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    infoContent.classList.remove("hidden");
    castContent.classList.add("hidden");
    commentsContent.classList.add("hidden");
    tabContentContainer.classList.remove("hidden");
  });

  castTabButton.addEventListener("click", async () => {
    castTabButton.classList.add("border-orange-500", "text-orange-500");
    castTabButton.classList.remove(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    infoTabButton.classList.remove("border-orange-500", "text-orange-500");
    infoTabButton.classList.add(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    commentsTabButton.classList.remove("border-orange-500", "text-orange-500");
    commentsTabButton.classList.add(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    castContent.classList.remove("hidden");
    infoContent.classList.add("hidden");
    commentsContent.classList.add("hidden");
    tabContentContainer.classList.remove("hidden");

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
          "flex overflow-x-auto space-x-4 pb-4 slider-container";
        cast.slice(0, 10).forEach((actor) => {
          const actorCard = document.createElement("div");
          actorCard.className =
            "flex-shrink-0 w-24 flex flex-col items-center text-center";
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
          actorName.className = "text-sm font-semibold truncate w-full";
          actorName.textContent = actor.name;
          actorCard.appendChild(actorName);
          const characterName = document.createElement("p");
          characterName.className = "text-xs text-gray-400 truncate w-full";
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
    commentsTabButton.classList.add("border-orange-500", "text-orange-500");
    commentsTabButton.classList.remove(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    infoTabButton.classList.remove("border-orange-500", "text-orange-500");
    infoTabButton.classList.add(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    castTabButton.classList.remove("border-orange-500", "text-orange-500");
    castTabButton.classList.add(
      "border-transparent",
      "text-gray-400",
      "hover:text-white"
    );
    commentsContent.classList.remove("hidden");
    infoContent.classList.add("hidden");
    castContent.classList.add("hidden");
    tabContentContainer.classList.remove("hidden");

    if (typeof FB !== "undefined" && FB.XFBML) {
      setTimeout(() => {
        FB.XFBML.parse(commentsContent);
      }, 100);
    }
  });

  movieDetailContainer.appendChild(contentWrapper);

  const trailerModal = document.createElement("div");
  trailerModal.id = "trailer-modal";
  trailerModal.className =
    "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] hidden";
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

  if (trailer) {
    trailerButton.style.display = "flex";
    trailerButton.addEventListener("click", () => {
      const trailerIframeContainer = trailerModal.querySelector(
        "#trailer-iframe-container"
      );
      trailerIframeContainer.innerHTML = `
              <iframe
                src="https://www.youtube.com/embed/${trailer.key}?autoplay=1"
                allow="autoplay; encrypted-media"
                allowfullscreen
                class="w-full h-full"
              ></iframe>
            `;
      trailerModal.classList.remove("hidden");
    });
  } else {
    trailerButton.style.display = "none";
  }

  trailerModal
    .querySelector("#close-trailer-modal")
    .addEventListener("click", () => {
      trailerModal.classList.add("hidden");
      trailerModal.querySelector("#trailer-iframe-container").innerHTML = "";
    });

  return movieDetailContainer;
}

function getFlagIcon(languageCode) {
  const flagMap = {
    en: "🇺🇸", // English
    es: "🇪🇸", // Spanish (Spain)
    "es-MX": "🇲🇽", // Spanish (Mexico)
    ja: "🇯🇵", // Japanese
    // Add more language codes and their corresponding flag emojis as needed
  };

  const flag = flagMap[languageCode] || "🌐"; // Default to a globe icon if flag not found

  return `<div class="absolute top-2 left-2 text-xl">${flag}</div>`;
}

export function buildCard(imageBaseUrl, item) {
  const card = document.createElement("div");
  card.className =
    "bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden w-full max-w-md flex items-center";

  const imageUrl = item.poster_path
    ? `${imageBaseUrl}${item.poster_path}`
    : "https://via.placeholder.com/150x225?text=No+Image";
  const title =
    item.title || item.name || item.original_title || item.original_name;
  const releaseDate = item.release_date || item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

  card.innerHTML = `
          <div class="relative w-32 h-20 flex-shrink-0 rounded-l-lg overflow-hidden">
            <img src="${
              item.backdrop_path
                ? `${imageBaseUrl}${item.backdrop_path}`
                : "https://via.placeholder.com/300x169?text=No+Image"
            }" alt="${title}" class="absolute inset-0 w-full h-full object-cover" />
          ${
            item.isAdult
              ? `<div class="adult-badge">+18</div>`
                : ""
            }
            ${
              item.logo_path
                ? `<img src="${imageBaseUrl}${item.logo_path}" alt="${title} logo" class="absolute inset-0 m-auto h-12 object-contain" />`
                : `<h3 class="absolute inset-0 m-auto text-white text-sm font-bold flex items-center justify-center text-center">${title}</h3>`
            }
          </div>
          <div class="p-3 flex flex-col justify-center flex-grow">
            <h3 class="text-base font-semibold text-white">${title}</h3>
            <p class="text-gray-400 text-xs">${year}</p>
          </div>
          <div class="p-3 flex items-center flex-shrink-0">
            <button class="bg-orange-500 hover:bg-orange-600 text-white font-bold p-1 rounded-full inline-flex items-center justify-center text-xs">
              <i class="fas fa-play-circle"></i>
            </button>
          </div>
        `;

  card.addEventListener("click", () => {
    const customUrl = `go:${item.id}`;
    window.open(customUrl, "_self");
  });

  return card;
};

export function buildSliderPoster(imageBaseUrl, item) {
  const poster = document.createElement("div");
  poster.className =
    "flex-none w-20 h-auto rounded-lg overflow-hidden shadow-lg bg-gray-800 cursor-pointer cooca-slider-item relative"; // Added relative
  poster.innerHTML = `
          <img src="${imageBaseUrl}${item.poster_path}" alt="${
    item.title || item.name
  }" class="w-full h-full object-cover">
          ${
            item.isAdult
              ? `<div class="adult-badge">+18</div>`
              : ""
          }
        `;
  poster.addEventListener("click", () => {
    const customUrl = `go:${item.id}`;
    window.open(customUrl, "_self");
  });
  return poster;
}


// --- SCRIPT FUNCTIONS ---

export async function fetchMediaDetails(
  apiBaseUrl,
  type,
  id,
  season_number = null,
  episode_number = null
) {
  try {
    let mainDetails = {};
    let episodeDetails = null;
    let episodeStills = [];
    const languagePriority = ["es-MX", "es-ES", "en"];

    // 1. Fetch main media details (series or movie)
    for (const lang of languagePriority) {
      const url = `${apiBaseUrl}/${type}/${id}?api_key=${tmdbApiKey}&language=${lang}`;
      const response = await fetch(url);
      if (response.ok) {
        mainDetails = await response.json();
        if (mainDetails.title || mainDetails.name || mainDetails.overview) {
          break;
        }
      }
    }
    if (!mainDetails.id) {
      // Fallback without language if no good data found
      const url = `${apiBaseUrl}/${type}/${id}?api_key=${tmdbApiKey}`;
      const response = await fetch(url);
      if (response.ok) {
        mainDetails = await response.json();
      }
    }

    if (!mainDetails.id) {
      console.warn(
        `Could not fetch main details for ${type} with ID ${id} in any language.`
      );
      return null; // Cannot proceed without main media details
    }

    // 2. Fetch main media images (logos, backdrops, posters)
    let mainImagesData = { logos: [], backdrops: [], posters: [] };
    try {
      const imagesUrl = `${apiBaseUrl}/${type}/${id}/images?api_key=${tmdbApiKey}&include_image_language=es-MX,es-ES,en,ja,null`;
      const imagesResponse = await fetch(imagesUrl);
      if (imagesResponse.ok) {
        mainImagesData = await imagesResponse.json();
      } else {
        console.warn(
          `No se pudieron obtener imágenes principales para ${type} con ID ${id}.`
        );
      }
    } catch (err) {
      console.warn(
        `Error al obtener imágenes principales de TMDB para ID ${id}:`,
        err
      );
    }

    // Select logo from main images
    let logoPath = null;
    if (mainImagesData.logos?.length > 0) {
      const priority = ["es-MX", "es-ES", "en", "ja", null];
      for (const lang of priority) {
        const logo = mainImagesData.logos.find((l) => l.iso_639_1 === lang);
        if (logo) {
          logoPath = logo.file_path;
          break;
        }
      }
      if (!logoPath && mainImagesData.logos.length > 0) {
        logoPath = mainImagesData.logos[0].file_path;
      }
    }

    // 3. If it's a TV show and season/episode numbers are provided, fetch episode details and stills
    if (type === "tv" && season_number !== null && episode_number !== null) {
      for (const lang of languagePriority) {
        const url = `${apiBaseUrl}/${type}/${id}/season/${season_number}/episode/${episode_number}?api_key=${tmdbApiKey}&language=${lang}`;
        const response = await fetch(url);
        if (response.ok) {
          episodeDetails = await response.json();
          if (episodeDetails.name || episodeDetails.overview) {
            break;
          }
        }
      }
      if (
        !episodeDetails ||
        (!episodeDetails.name && !episodeDetails.overview)
      ) {
        // Fallback without language
        const url = `${apiBaseUrl}/tv/${id}/season/${season_number}/episode/${episode_number}?api_key=${tmdbApiKey}`;
        const response = await fetch(url);
        if (response.ok) {
          episodeDetails = await response.json();
        }
      }

      if (!episodeDetails) {
        console.warn(
          `Could not fetch episode details for TV ID ${id}, Season ${season_number}, Episode ${episode_number} in any language.`
        );
      }

      // Fetch episode stills
      try {
        const stillsUrl = `${apiBaseUrl}/${type}/${id}/season/${season_number}/episode/${episode_number}/images?api_key=${tmdbApiKey}&include_image_language=es-MX,es-ES,en,ja,null`;
        const stillsResponse = await fetch(stillsUrl);
        if (stillsResponse.ok) {
          episodeStills = (await stillsResponse.json()).stills || [];
        } else {
          console.warn(
            `No se pudieron obtener stills para el episodio ${episode_number} de la temporada ${season_number} de TV ID ${id}.`
        );
        }
      } catch (err) {
        console.warn(
          `Error al obtener stills de TMDB para episodio ${episode_number}:`,
          err
        );
      }
    }

    // Select still for episodes: priority es-MX > es-ES > en > ja > null
    let stillPath = null;
    if (episodeStills.length > 0) {
      const priority = ["es-MX", "es-ES", "en", "ja", null];
      for (const lang of priority) {
        const still = episodeStills.find((s) => s.iso_639_1 === lang);
        if (still) {
          stillPath = still.file_path;
          break;
        }
      }
      if (!stillPath && episodeStills.length > 0) {
        stillPath = episodeStills[0].file_path;
      }
    }

    // Combine main details with episode details, prioritizing episode details for specific fields
    const combinedDetails = {
      ...mainDetails,
      logo_path: logoPath,
      genres: mainDetails.genres,
      language: mainDetails.spoken_languages
        ? mainDetails.spoken_languages.map((lang) => lang.iso_639_1).join(",")
        : mainDetails.original_language,
    };

    // Store the original series name if it's a TV show
    if (type === "tv") {
      combinedDetails.series_name = mainDetails.name;
    }

    if (episodeDetails) {
      combinedDetails.episode_name = episodeDetails.name;
      combinedDetails.episode_overview = episodeDetails.overview;
      combinedDetails.episode_number = episodeDetails.episode_number;
      combinedDetails.season_number = episodeDetails.season_number;
      combinedDetails.still_path = stillPath;
      if (episodeDetails.overview)
        combinedDetails.overview = episodeDetails.overview;
      if (episodeDetails.name) combinedDetails.name = episodeDetails.name;
    }

    if (combinedDetails.pageUrl) {
      delete combinedDetails.pageUrl;
    }

    return combinedDetails;
  } catch (error) {
    console.error(`Error fetching ${type} with ID ${id}:`, error);
    return null;
  }
}

async function fetchTrendingMedia(
  apiBaseUrl,
  timeWindow = "week",
  mediaType = "all"
) {
  try {
    const url = `${apiBaseUrl}/trending/${mediaType}/${timeWindow}?api_key=${tmdbApiKey}&language=es-ES`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(
      `Error fetching trending ${mediaType} (${timeWindow}):`,
      error
    );
    return [];
  }
}

export async function fetchOnTheAirTvShows(apiBaseUrl) {
  try {
    const url = `${apiBaseUrl}/tv/on_the_air?api_key=${tmdbApiKey}&language=es-ES`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching on the air TV shows:", error);
    return [];
  }
}

export async function fetchEndedTvShows(apiBaseUrl) {
  try {
    const url = `${apiBaseUrl}/discover/tv?api_key=${tmdbApiKey}&language=es-ES&sort_by=popularity.desc&air_date.lte=${new Date().toISOString().split('T')[0]}&status=ended&with_status=ended`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching ended TV shows:", error);
    return [];
  }
}

async function fetchMovies(apiBaseUrl) {
  try {
    const url = `${apiBaseUrl}/discover/movie?api_key=${tmdbApiKey}&language=es-ES&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

async function fetchSpecificMovies(apiBaseUrl, movieData) {
  try {
    const movieDetailsPromises = movieData.map(async (movie) => {
      if (movie.type === "movie") {
        return await fetchMediaDetails(apiBaseUrl, movie.type, movie.id);
      }
      return null;
    });
    const movies = await Promise.all(movieDetailsPromises);
    return movies.filter(Boolean);
  } catch (error) {
    console.error("Error fetching specific movies:", error);
    return [];
  }
}

async function fetchMediaVideos(apiBaseUrl, mediaType, mediaId) {
  try {
    const url = `${apiBaseUrl}/${mediaType}/${mediaId}/videos?api_key=${tmdbApiKey}&language=es-ES`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(
      `Error fetching videos for ${mediaType} ID ${mediaId}:`,
      error
    );
    return [];
  }
}

async function fetchCast(
  apiBaseUrl,
  type,
  id,
  season_number = null,
  episode_number = null
) {
  try {
    let url;
    if (type === "movie") {
      url = `${apiBaseUrl}/movie/${id}/credits?api_key=${tmdbApiKey}&language=es-ES`;
    } else if (
      type === "tv" &&
      season_number !== null &&
      episode_number !== null
    ) {
      url = `${apiBaseUrl}/tv/${id}/season/${season_number}/episode/${episode_number}/credits?api_key=${tmdbApiKey}&language=es-ES`;
    } else if (type === "tv") {
      url = `${apiBaseUrl}/tv/${id}/credits?api_key=${tmdbApiKey}&language=es-ES`;
    } else {
      throw new Error("Unsupported media type for fetching cast.");
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.cast || data.crew;
  } catch (error) {
    console.error(`Error fetching cast for ${type} with ID ${id}:`, error);
    return [];
  }
}

async function fetchTvSeasonDetails(apiBaseUrl, tvId, seasonNumber) {
  try {
    const languagePriority = ["es-MX", "es-ES", "en"];
    let seasonData = null;

    for (const lang of languagePriority) {
      const url = `${apiBaseUrl}/tv/${tvId}/season/${seasonNumber}?api_key=${tmdbApiKey}&language=${lang}`;
      const response = await fetch(url);
      if (response.ok) {
        seasonData = await response.json();
        if (seasonData.episodes && seasonData.episodes.length > 0) {
          const hasContent = seasonData.episodes.some(
            (ep) => ep.name || ep.overview
          );
          if (hasContent) {
            break;
          }
        }
      }
    }

    if (
      !seasonData ||
      !seasonData.episodes ||
      seasonData.episodes.length === 0
    ) {
      const url = `${apiBaseUrl}/tv/${tvId}/season/${seasonNumber}?api_key=${tmdbApiKey}`;
      const response = await fetch(url);
      if (response.ok) {
        seasonData = await response.json();
      }
    }

    if (!seasonData || !seasonData.episodes) {
      console.warn(
        `Could not fetch season ${seasonNumber} details for TV ID ${tvId} in any language.`
      );
      return [];
    }

    return seasonData.episodes;
  } catch (error) {
    console.error(
      `Error fetching season ${seasonNumber} details for TV ID ${tvId}:`,
      error
    );
    return [];
  }
}

async function fetchEpisodeDetails(
  apiBaseUrl,
  tvId,
  seasonNumber,
  episodeNumber
) {
  try {
    const languagePriority = ["es-MX", "es-ES", "en"];
    let episodeData = null;

    for (const lang of languagePriority) {
      const url = `${apiBaseUrl}/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${tmdbApiKey}&language=${lang}`;
      const response = await fetch(url);
      if (response.ok) {
        episodeData = await response.json();
        if (episodeData.name || episodeData.overview) {
          break;
        }
      }
    }

    if (!episodeData || (!episodeData.name && !episodeData.overview)) {
      const url = `${apiBaseUrl}/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${tmdbApiKey}`;
      const response = await fetch(url);
      if (response.ok) {
        episodeData = await response.json();
      }
    }

    if (!episodeData) {
      console.warn(
        `Could not fetch episode details for TV ID ${tvId}, Season ${seasonNumber}, Episode ${episodeNumber} in any language.`
      );
      return null;
    }

    let imagesData = { stills: [] };
    try {
      const imagesUrl = `${apiBaseUrl}/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/images?api_key=${tmdbApiKey}&include_image_language=es-MX,es-ES,en,ja,null`;
      const imagesResponse = await fetch(imagesUrl);
      if (imagesResponse.ok) {
        imagesData = await imagesResponse.json();
      } else {
        console.warn(
          `No se pudieron obtener imágenes para el episodio ${episodeNumber} de la temporada ${seasonNumber} de TV ID ${tvId}.`
        );
      }
    } catch (err) {
      console.warn(
        `Error al obtener stills de TMDB para el episodio ${episodeNumber}:`,
        err
      );
    }

    let stillPath = null;
    if (imagesData.stills?.length > 0) {
      const priority = ["es-MX", "es-ES", "en", "ja", null];
      for (const lang of priority) {
        const still = imagesData.stills.find((s) => s.iso_639_1 === lang);
        if (still) {
          stillPath = still.file_path;
          break;
        }
      }
      if (!stillPath && imagesData.stills.length > 0) {
        stillPath = imagesData.stills[0].file_path;
      }
    }

    return { ...episodeData, still_path: stillPath };
  } catch (error) {
    console.error(
      `Error fetching episode details for TV ID ${tvId}, Season ${seasonNumber}, Episode ${episodeNumber}:`,
      error
    );
    return null;
  }
}

async function fetchContentRatings(apiBaseUrl, movieId) {
  try {
    const url = `${apiBaseUrl}/movie/${movieId}/release_dates?api_key=${tmdbApiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const ratings = data.results.filter(
      (result) =>
        result.release_dates.length > 0 && result.release_dates[0].certification
    );
    return ratings.map((result) => ({
      iso_3166_1: result.iso_3166_1,
      rating: result.release_dates[0].certification,
    }));
  } catch (error) {
    console.error(
      `Error fetching content ratings for movie ID ${movieId}:`,
      error
    );
    return [];
  }
}

window.fetchGenres = async (apiBaseUrl, mediaType) => {
  try {
    const url = `${apiBaseUrl}/genre/${mediaType}/list?api_key=${tmdbApiKey}&language=es-ES`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error(`Error fetching ${mediaType} genres:`, error);
    return [];
  }
};

export function showNotification(message, type = "info", gifUrl = null) {
  const notificationContainer = document.getElementById(
    "notification-container"
  );
  if (!notificationContainer) {
    console.warn("Notification container not found.");
    return;
  }

  const notification = document.createElement("div");
  notification.className = `notification ${type} p-3 mb-2 rounded-lg shadow-md text-white flex items-center space-x-3`;

  // Remove bgColorClass logic from JS, rely on CSS for .notification background
  // The 'type' class is still added for potential future styling (e.g., text color, icons)
  // but the background will be handled by the .notification CSS rule.

  if (gifUrl) {
    notification.innerHTML = `
      <img src="${gifUrl}" alt="GIF" class="w-10 h-10 rounded-full flex-shrink-0">
      <span>${message}</span>
    `;
  } else {
    notification.textContent = message;
  }

  notificationContainer.prepend(notification);

  setTimeout(() => {
    notification.remove();
  }, 3500); // Increased timeout to allow animation to complete
}

// Debounce function to limit API calls (from buscador/request-modal.js)
export function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

// --- MAIN APP LOGIC AND ROUTING ---
const apiBaseUrl = "https://api.themoviedb.org/3";
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
const backdropBaseUrl = "https://image.tmdb.org/t/p/w780";
const appRoot = document.getElementById("app-root");

// Make apiBaseUrl globally accessible for other modules
window.apiBaseUrl = apiBaseUrl;

// Global variable to store all fetched media details
window.allMediaDetails = [];
// Global variable to store raw, unfiltered media details
window.rawAllMediaDetails = [];

// Define localEpisodesDb to prevent errors, it would be populated by a backend in a real app
// For demonstration purposes, we'll populate it with dummy data for a TV series.
const localEpisodesDb = {
  "31910": { // Example series ID from index.html
    "1": [ // Season 1
      { episode_number: 1, url: "#series/31910/season/1/episode/1" },
      { episode_number: 2, url: "#series/31910/season/1/episode/2" },
      { episode_number: 3, url: "#series/31910/season/1/episode/3" },
      { episode_number: 4, url: "#series/31910/season/1/episode/4" },
      { episode_number: 5, url: "#series/31910/season/1/episode/5" },
    ],
    "2": [ // Season 2
      { episode_number: 1, url: "#series/31910/season/2/episode/1" },
      { episode_number: 2, url: "#series/31910/season/2/episode/2" },
      { episode_number: 3, url: "#series/31910/season/2/episode/3" },
    ],
  },
  // Add more series and their seasons/episodes as needed for testing
};

// Make imageBaseUrl globally accessible for other modules
window.imageBaseUrl = imageBaseUrl;

// --- Progress Data Management ---

// Function to render/re-render the progress section
window.updateProgressSection = async (container, isAdultContent = false, adultMediaDetails = []) => {
  const progressContentDiv = container.querySelector("#progress-content");
  if (!progressContentDiv) {
    console.error("Progress content div not found.");
    return;
  }

  let yamiProgress, yamiVideoProgress;
  try {
    yamiProgress = JSON.parse(localStorage.getItem("Yamiprogress") || "{}");
    yamiVideoProgress = JSON.parse(localStorage.getItem("yamivideoprogress") || "{}");
  } catch (error) {
    console.error("Error parsing progress data from localStorage:", error);
    progressContentDiv.innerHTML = "<p class='text-center text-red-500'>Error al cargar el progreso.</p>";
    return;
  }

  const allMediaIds = new Set([
    ...Object.keys(yamiProgress),
    ...Object.keys(yamiVideoProgress),
  ]);

  let mergedProgressData = [];
  for (const mediaIdKey of allMediaIds) {
    const yamiItem = yamiProgress[mediaIdKey];
    const videoItem = yamiVideoProgress[mediaIdKey];

    if (yamiItem === null) continue;
    if (!yamiItem && !videoItem) continue;

    const mediaId = parseInt(mediaIdKey);
    const fullMediaItem = window.rawAllMediaDetails.find(item => item.id === mediaId);

    // Skip if the item is not found in the main media list or if adult status doesn't match
    if (!fullMediaItem || fullMediaItem.isAdult !== isAdultContent) {
      continue;
    }
    
    const mediaType = fullMediaItem.type;
    const seasonNumber = yamiItem?.seasonNumber || null;
    const episodeNumber = yamiItem?.episodeNumber || null;
    const url = yamiItem?.url || `go:${mediaId}`;
    const currentTime = videoItem?.currentTime || 0;
    const duration = videoItem?.duration || 0;
    let percentage = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

    let watchedEpisodes = 0;
    let totalEpisodes = 0;

    if (mediaType === 'tv') {
        const watchedEpisodesData = JSON.parse(localStorage.getItem("watchedEpisodes") || "{}");
        if (watchedEpisodesData[mediaId]) {
            for (const sNum in watchedEpisodesData[mediaId]) {
                for (const epNum in watchedEpisodesData[mediaId][sNum]) {
                    if (watchedEpisodesData[mediaId][sNum][epNum]) {
                        watchedEpisodes++;
                    }
                }
            }
        }

        if (localEpisodesDb[mediaId]) {
            for (const sNum in localEpisodesDb[mediaId]) {
                totalEpisodes += localEpisodesDb[mediaId][sNum].length;
            }
        }

        if (totalEpisodes > 0) {
            percentage = (watchedEpisodes / totalEpisodes) * 100;
        }
    }

    mergedProgressData.push({
      id: mediaId,
      type: mediaType,
      seasonNumber: seasonNumber,
      episodeNumber: episodeNumber,
      url: url,
      isAdult: fullMediaItem.isAdult,
      progress: {
        currentTime,
        duration,
        percentage,
        watchedEpisodes,
        totalEpisodes,
      },
    });
  }

  // Fetch full details for each item
  const detailedProgressItems = await Promise.all(
    mergedProgressData.map(async (item) => {
      const mediaDetails = await fetchMediaDetails(apiBaseUrl, item.type, item.id, item.seasonNumber, item.episodeNumber);
      return mediaDetails ? {
        ...item,
        ...mediaDetails,
        title: mediaDetails.episode_name || mediaDetails.title || mediaDetails.name // Prioritize episode_name for title
      } : null;
    })
  );

  let validDetailedProgressItems = detailedProgressItems.filter(Boolean);
  let itemsToRemove = [];

  // Identify items that are 100% complete
  validDetailedProgressItems.forEach(item => {
    if (item.progress.percentage >= 100) {
      itemsToRemove.push(item);
    }
  });

  // Remove 100% complete items from local storage
  itemsToRemove.forEach(item => {
    console.log(`Removing 100% complete item: ${item.title || item.name} (ID: ${item.id})`);
    window.removeProgressItem(item.id, item.type, item.title || item.name, true); // true to skip confirmation
  });

  // Filter out items that were just removed (or were already 100%)
  validDetailedProgressItems = validDetailedProgressItems.filter(item => item.progress.percentage < 100);

  progressContentDiv.innerHTML = ""; // Clear existing content

  if (validDetailedProgressItems.length > 0) {
    container.style.display = 'block';
    progressContentDiv.appendChild(
      createContinueWatchingSlider(
        window.imageBaseUrl,
        "Continuar viendo",
        validDetailedProgressItems,
        isAdultContent // Pass the isAdultContent parameter
      )
    );
  } else {
    container.style.display = 'none';
  }
};

// Function to show a custom confirmation dialog
function showConfirmationDialog(message, onConfirm, onCancel) {
  const dialogOverlay = document.createElement("div");
  dialogOverlay.className = "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1000]";
  dialogOverlay.innerHTML = `
    <div class="bg-gray-800 p-6 rounded-lg shadow-xl max-w-xs mx-auto text-center">
      <p class="text-white text-lg mb-6">${message}</p>
      <div class="flex justify-center space-x-4">
        <button id="confirm-btn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Confirmar
        </button>
        <button id="cancel-btn" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(dialogOverlay);

  dialogOverlay.querySelector("#confirm-btn").addEventListener("click", () => {
    onConfirm();
    dialogOverlay.remove();
  });

  dialogOverlay.querySelector("#cancel-btn").addEventListener("click", () => {
    if (onCancel) onCancel();
    dialogOverlay.remove();
  });
}

// Global function to remove an item from progress
window.removeProgressItem = (idToRemove, typeToRemove, titleToRemove, skipConfirmation = false) => {
  const performRemoval = () => {
    try {
      let yamiProgress = JSON.parse(localStorage.getItem("Yamiprogress") || "{}");
      let yamiVideoProgress = JSON.parse(localStorage.getItem("yamivideoprogress") || "{}");
      let watchedEpisodes = JSON.parse(localStorage.getItem("watchedEpisodes") || "{}");

      const mediaIdKey = String(idToRemove);
      let itemRemoved = false;

      if (yamiProgress.hasOwnProperty(mediaIdKey)) {
        delete yamiProgress[mediaIdKey];
        localStorage.setItem("Yamiprogress", JSON.stringify(yamiProgress));
        itemRemoved = true;
      }

      if (yamiVideoProgress.hasOwnProperty(mediaIdKey)) {
        delete yamiVideoProgress[mediaIdKey];
        localStorage.setItem("yamivideoprogress", JSON.stringify(yamiVideoProgress));
        itemRemoved = true;
      }

      // Also clear watchedEpisodes for the series if it's a TV show
      if (typeToRemove === 'tv' && watchedEpisodes.hasOwnProperty(mediaIdKey)) {
        delete watchedEpisodes[mediaIdKey];
        localStorage.setItem("watchedEpisodes", JSON.stringify(watchedEpisodes));
        itemRemoved = true; // Consider this part of the removal
      }

      if (itemRemoved) {
        if (!skipConfirmation) {
          showNotification(`"${titleToRemove}" eliminado de Continuar viendo.`, "success");
        }
        // Dispatch a custom event to notify other parts of the app about the update
        const event = new CustomEvent('yamiProgressUpdated');
        window.dispatchEvent(event);
      } else {
        console.warn(`Item ${idToRemove} (${typeToRemove}) not found in progress data.`);
      }
    } catch (error) {
      console.error("Error removing progress item from localStorage:", error);
      if (!skipConfirmation) {
        showNotification("Error al eliminar el progreso.", "error");
      }
    }
  };

  if (skipConfirmation) {
    performRemoval();
  } else {
    showConfirmationDialog(`¿Estás seguro de que quieres eliminar "${titleToRemove}" de Continuar viendo?`, performRemoval);
  }
};

// Global function to remove an item from allMediaDetails and rawAllMediaDetails
window.removeItem = (idToRemove, typeToRemove) => {
  console.log(`Attempting to remove item: ID=${idToRemove}, Type=${typeToRemove}`);

  // Remove from rawAllMediaDetails
  window.rawAllMediaDetails = window.rawAllMediaDetails.filter(
    (item) => !(item.id === idToRemove && item.type === typeToRemove)
  );
  console.log("rawAllMediaDetails after removal:", window.rawAllMediaDetails);

  // Re-apply adult content filter to update allMediaDetails
  applyAdultContentFilterAndSetGlobalMedia();
  console.log("allMediaDetails after re-filtering:", window.allMediaDetails);

  // Trigger a re-render of the current page to reflect the changes
  handleNavigation();
  showNotification(`"${idToRemove}" eliminado correctamente.`, "success");
};

async function initPeliculas() {
  const mainContentDiv = document.getElementById("app-main-content");
  mainContentDiv.innerHTML = "";
  mainContentDiv.appendChild(buildPeliculasMainContent());

  const movies = window.allMediaDetails.filter(
    (item) => item.categoria.includes("peliculas") && item.type === "movie"
  );

  const moviesSection = mainContentDiv.querySelector("#movies-section");
  if (moviesSection) {
    moviesSection.appendChild(createMovieGrid(imageBaseUrl, movies));
  }
}

async function initSeries() {
  console.log("initSeries called");
  const appMainContent = document.getElementById("app-main-content");
  appMainContent.innerHTML = ""; // Clear previous content

  if (window.initSeriesPageContent) {
    console.log(
      "Calling initSeriesPageContent with:",
      appMainContent, // Pass appMainContent directly
      window.allMediaDetails,
      imageBaseUrl
    );
    window.initSeriesPageContent(appMainContent, window.allMediaDetails, imageBaseUrl);
  } else {
    console.error("window.initSeriesPageContent is not defined.");
  }
}

async function initMediaDetail(
  mediaId,
  mediaType,
  seasonNumber,
  episodeNumber
) {
  const mainContentDiv = document.getElementById("app-main-content");
  mainContentDiv.innerHTML = "";
  // Use the appropriate template for detail page, assuming series-template is generic enough for now
  mainContentDiv.appendChild(buildSeriesMainContent());

  const mediaDetailSection = mainContentDiv.querySelector(
    "#series-section" // Changed from movie-detail-section to series-section
  );

  const mediaDetails = window.allMediaDetails.find(
    (detail) => detail.id === mediaId && detail.type === mediaType
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
      localEpisodesDb
    );
    mediaDetailSection.appendChild(mediaDetailPageElement);
  } else {
    mediaDetailSection.innerHTML =
      "<p class='text-center text-red-500'>No se pudo cargar la información del contenido.</p>";
  }
}


async function initFavoritos() {
  const mainContentDiv = document.getElementById("app-main-content");
  mainContentDiv.innerHTML = "";
  // Append the template directly
  const favoritesPageContainer = document.createElement("main");
  favoritesPageContainer.id = "main-content";
  favoritesPageContainer.className = "w-full min-h-screen bg-gray-900 text-white max-w-4xl mx-auto p-4 pb-20";
  favoritesPageContainer.innerHTML = favoritosTemplate;
  mainContentDiv.appendChild(favoritesPageContainer);

  // Initialize the favorites page logic from favoritos.js
  initializeFavoritesPage();
}

let globalHeaderElement;
let globalNavigationBarElement;
let previousHash = "#home";

async function handleNavigation() {
  const currentHash = window.location.hash.substring(1);
  if (currentHash !== "buscador") {
    previousHash = window.location.hash;
  }
  const hash = window.location.hash.substring(1);
  const appMainContent = document.getElementById("app-main-content");

  // Clear existing content in appMainContent
  appMainContent.innerHTML = "";
  appMainContent.scrollTo(0, 0); // Reset scroll position to top

  // Remove existing header and navigation bar to rebuild them
  if (globalHeaderElement && globalHeaderElement.parentNode) {
    globalHeaderElement.parentNode.removeChild(globalHeaderElement);
  }
  if (globalNavigationBarElement && globalNavigationBarElement.parentNode) {
    globalNavigationBarElement.parentNode.removeChild(globalNavigationBarElement);
  }

  let currentHeader;
  if (hash === "adult-content") {
    currentHeader = buildGlobalHeader(
      "Yami",
      "H",
      "text-purple-adult text-yami-h-adult", // Add new class for larger H and spacing
      `<i class="fas fa-fire text-2xl h-7 w-7 md:h-8 md:w-8 text-purple-adult"></i>` // Add text-2xl for size
    );
  } else {
    currentHeader = buildGlobalHeader(); // Default header
  }
  appRoot.prepend(currentHeader); // Prepend to ensure it's at the top

  globalHeaderElement = currentHeader; // Update global reference

  globalNavigationBarElement = buildGlobalNavigationBar();
  appRoot.appendChild(globalNavigationBarElement);

  // Determine if header should be hidden
  const hideHeader = hash === "buscador" || hash === "explorar";
  // Determine if navbar should be hidden
  const hideNavbar = hash === "buscador";

  if (globalHeaderElement) {
    globalHeaderElement.classList.toggle("hidden", hideHeader);
  }
  if (globalNavigationBarElement) {
    globalNavigationBarElement.classList.toggle("hidden", hideNavbar);
  }

  // Always update Prestigio Plus visibility after header is rebuilt
  window.updatePrestigioPlusVisibility();

  const premiumBtn = document.getElementById("premium-btn");
  if (premiumBtn) {
    if (hash === "adult-content") {
      premiumBtn.innerHTML = `<i class="fas fa-fire text-lg md:text-xl text-white"></i>`;
      premiumBtn.classList.remove("text-orange-500", "hover:text-orange-300", "bg-gray-800", "hover:bg-gray-700");
      premiumBtn.classList.add("bg-prestigio-plus-adult", "hover:bg-purple-700");
    } else {
      premiumBtn.innerHTML = `<i class="fas fa-crown text-lg md:text-xl"></i>`;
      premiumBtn.classList.remove("text-purple-adult", "hover:text-purple-300");
      premiumBtn.classList.add("text-orange-500", "hover:text-orange-300");
    }
  }

  if (hash.startsWith("series/")) {
    const parts = hash.split("/");
    const mediaId = parseInt(parts[1]);
    let seasonNumber = null;
    let episodeNumber = null;

    // Removed automatic progress item addition on navigation.
    // Progress items are now explicitly added/updated via processYamiProgressInput.

    if (
      parts[2] === "season" &&
      parts[3] &&
      parts[4] === "episode" &&
      parts[5]
    ) {
      seasonNumber = parseInt(parts[3]);
      episodeNumber = parseInt(parts[5]);
    }
    await initMediaDetail(mediaId, "tv", seasonNumber, episodeNumber);
  } else if (hash.startsWith("peliculas/")) {
    const parts = hash.split("/");
    const mediaId = parseInt(parts[1]);
    await initMediaDetail(mediaId, "movie", null, null);
  } else if (hash === "explorar") {
    await initSeries();
  } else if (hash === "buscador") {
    await initBuscador(appMainContent);
  } else if (hash === "favoritos") {
    await initFavoritos();
  } else if (hash === "adult-content") {
    console.log("Adult Content button clicked. Loading adult content section.");
    appMainContent.innerHTML = ""; // Clear previous content
    // No need to call filterAndSetAllMediaDetails here, as applyAdultContentFilterAndSetGlobalMedia will be called
    loadAdultContentSection(window.allMediaDetails, window.imageBaseUrl);
  } else if (hash === "configuracion") {
    console.log(
      "Configuración button clicked. Loading configuracion.js content."
    );
    if (window.initConfiguracionPageContent) {
      window.initConfiguracionPageContent(appMainContent);
    } else {
      console.error("window.initConfiguracionPageContent is not defined.");
      appMainContent.innerHTML = `
          <main id="main-content" class="p-5 text-center">
            <h2 class="text-2xl font-bold text-red-500">Error al cargar Configuración</h2>
            <p class="text-gray-400 mt-4">El contenido de configuración no pudo ser cargado.</p>
          </main>
        `;
    }
  } else {
    // Default to home
    await initHome(appMainContent);
  }
  setActiveNavLink(hash);

  // After navigation, re-render progress sections
  const adultProgressSection = document.getElementById("adult-continue-watching-section");
  if (adultProgressSection) {
    window.updateProgressSection(adultProgressSection, true, globalAdultMediaDetails);
  }
  const homeProgressSection = document.getElementById("home-progress-section");
  if (homeProgressSection) {
    window.updateProgressSection(homeProgressSection, false);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM Content Loaded in script.js");
  // Initial build of header and nav bar
  globalHeaderElement = buildGlobalHeader();
  globalNavigationBarElement = buildGlobalNavigationBar();
  appRoot.appendChild(globalHeaderElement);
  appRoot.appendChild(globalNavigationBarElement);

  // Initial update for Prestigio Plus visibility in header
  window.updatePrestigioPlusVisibility();

  const appMainContent = document.createElement("div");
  appMainContent.id = "app-main-content";
  appRoot.appendChild(appMainContent);

  // Append the request modal to the app-root
  const requestModalTemplate = document.getElementById("request-modal-template");
  if (requestModalTemplate) {
    const clonedModal = requestModalTemplate.content.cloneNode(true);
    appRoot.appendChild(clonedModal);
    // Ensure the modal is hidden on initial load
    const requestModalElement = document.getElementById("request-modal");
    if (requestModalElement) {
      requestModalElement.classList.add("hidden");
    }
  }


  // Ensure adult content is enabled by default if not set
  if (localStorage.getItem("adultContentEnabled") === null) {
    localStorage.setItem("adultContentEnabled", "true");
  }

  // Function to update the navigation bar visibility for adult content
  window.updateNavigationBarVisibility = () => {
    if (globalNavigationBarElement) {
      globalNavigationBarElement.remove();
    }
    globalNavigationBarElement = buildGlobalNavigationBar();
    appRoot.appendChild(globalNavigationBarElement);
    setActiveNavLink(window.location.hash.substring(1)); // Re-set active link
  };

  // Content definitions are now directly embedded in index.html
  // No need to fetch db.json
  console.log(
    "Content definitions loaded from index.html:",
    window.contentDefinitionsFromDb
  );

  // Fetch all media details once and store them raw
  await fetchAllMediaDetailsRaw();
  // Apply initial filter based on user settings
  applyAdultContentFilterAndSetGlobalMedia();
  console.log("All media details fetched and filtered:", window.allMediaDetails);
  

  // Set default hash based on the stored default section or fallback to #home
  if (!window.location.hash) {
    window.location.hash = `#${window.initialDefaultSection}`;
  }


  handleNavigation(); // Initial load

  // Listen for custom event to update progress sections in real-time
  window.addEventListener('yamiProgressUpdated', () => {
    console.log("yamiProgressUpdated event received. Re-rendering progress sections.");
    const adultProgressSection = document.getElementById("adult-continue-watching-section");
    if (adultProgressSection) {
      window.updateProgressSection(adultProgressSection, true, globalAdultMediaDetails);
    }
    const homeProgressSection = document.getElementById("home-progress-section");
    if (homeProgressSection) {
      window.updateProgressSection(homeProgressSection, false);
    }
  });
});

  window.addEventListener("hashchange", handleNavigation);

// Function to re-filter content and refresh the display
window.refreshMainContentDisplay = async (isAdultContentEnabled) => {
  console.log("refreshMainContentDisplay called. Re-filtering content and re-rendering.");
  applyAdultContentFilterAndSetGlobalMedia(); // Re-filter based on current settings

  const currentHash = window.location.hash.substring(1);
  const appMainContent = document.getElementById("app-main-content");

  if (currentHash === "adult-content") {
    // If currently on the adult content section, re-render it directly
    appMainContent.innerHTML = ""; // Clear existing content
    loadAdultContentSection(window.allMediaDetails, window.imageBaseUrl);
  } else if (currentHash === "home") {
    // If on home, re-render home to reflect changes
    await initHome(appMainContent); // Pass appMainContent
  } else {
    // For other sections, just re-run navigation to refresh current view
    await handleNavigation();
  }
};

  window.updatePrestigioPlusVisibility = () => {
    const hidePrestigioPlus = localStorage.getItem("hidePrestigioPlusEnabled") === "true";
    console.log("updatePrestigioPlusVisibility called. hidePrestigioPlus:", hidePrestigioPlus);

    const premiumBtn = document.getElementById("premium-btn");
    if (premiumBtn) {
      console.log("Premium button found. Setting display to:", hidePrestigioPlus ? "none" : "flex");
      premiumBtn.style.display = hidePrestigioPlus ? "none" : "flex";
    } else {
      console.log("Premium button not found.");
    }

    // Call functions in other modules to update their Prestigio Plus elements
    if (window.updateConfiguracionPrestigioPlusVisibility) {
      window.updateConfiguracionPrestigioPlusVisibility("prestigio-plus-link", hidePrestigioPlus);
    }
    if (window.updatePrestigioPlusVisibilityAdult) {
      window.updatePrestigioPlusVisibilityAdult(hidePrestigioPlus);
    }
    if (window.updatePrestigioPlusVisibilityHome) {
      window.updatePrestigioPlusVisibilityHome(hidePrestigioPlus);
    }
  };

  async function fetchAllMediaDetailsRaw() {
  const fetchPromises = window.contentDefinitionsFromDb.map(async (item) => {
    const details = await fetchMediaDetails(apiBaseUrl, item.tipo, item.id);
    return details ? { ...item, ...details, type: item.tipo } : null;
  });
  window.rawAllMediaDetails = (await Promise.all(fetchPromises)).filter(Boolean);
}

function applyAdultContentFilterAndSetGlobalMedia() {
  const isAdultContentEnabledGlobally =
    localStorage.getItem("adultContentEnabled") === "true";

  let filteredMedia = [...window.rawAllMediaDetails]; // Start with a copy of raw data

  if (!isAdultContentEnabledGlobally) {
    filteredMedia = filteredMedia.filter((item) => !item.isAdult);
  }
  // Japanese content is always active, no filtering needed based on a toggle.
  // The language flag will be displayed if specified in the item's language property.

  window.allMediaDetails = filteredMedia;
}

export function getProgressData() {
  try {
    return JSON.parse(localStorage.getItem("Yamiprogress") || "{}");
  } catch (error) {
    console.error("Error parsing Yamiprogress data from localStorage:", error);
    return {};
  }
}

export function saveProgressData(data) {
  try {
    localStorage.setItem("Yamiprogress", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving Yamiprogress data to localStorage:", error);
  }
}

export function addOrUpdateContinueWatchingItem(mediaId, mediaType, seasonNumber, episodeNumber, url) {
  const progressData = getProgressData();
  progressData[mediaId] = {
    type: mediaType,
    seasonNumber: seasonNumber,
    episodeNumber: episodeNumber,
    url: url,
    timestamp: Date.now(),
  };
  saveProgressData(progressData);
}
