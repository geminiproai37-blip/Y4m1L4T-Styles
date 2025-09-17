// js/adultContent.js
import { createHeroSlider, createContentSlider, createLatestEpisodesSlider, fetchMediaDetails } from "./script.js"; // Import new slider and fetch function, and getProgressData

import { tmdbApiKey } from "./config.js"; // Import tmdbApiKey

export let globalAdultMediaDetails = [];
let globalImageBaseUrl = "";
let globalBackdropBaseUrl = "https://image.tmdb.org/t/p/w780"; // Assuming this is consistent
const apiBaseUrl = "https://api.themoviedb.org/3"; // Define apiBaseUrl here

function createPrestigioPlusSection() {
  const prestigioPlusSection = document.createElement("div");
  prestigioPlusSection.className = "px-2 sm:px-4 lg:px-6 mb-6";
  prestigioPlusSection.innerHTML = `
    <a href="http://action_noads
"  id="prestigio-plus-adult-link" class="block bg-prestigio-plus-adult rounded-xl p-4 shadow-lg flex items-center justify-between cursor-pointer transform hover:scale-[1.01] transition-transform duration-300 ring-1 ring-white/10 hover:ring-white/30">
        <div class="flex items-center space-x-3">
          <span class="material-icons-outlined text-3xl drop-shadow-lg text-white">local_fire_department</span>
          <div>
            <h3 class="text-lg font-bold text-white drop-shadow-md">Unete a Prestigio Plus <span class="ml-2 px-2 py-1 bg-white/30 text-white text-xs font-bold rounded-full">$5</span></h3>
            <p class="text-white/90 text-xs sm:text-sm">Experiencia sin anuncios <span class="font-bold text-white">Únete ahora</span> - Ilimitado</p>
          </div>
        </div>
        <div class="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200">
          <span class="material-icons-outlined text-lg text-white">arrow_forward</span>
        </div>
    </a>
  `;
  return prestigioPlusSection;
}

async function createSecicondEdestacadoSection(explosivoData) {
  if (!explosivoData || !explosivoData.active) {
    return null; // Do not create the section if not active
  }

  const mediaDetails = await fetchMediaDetails(apiBaseUrl, explosivoData.tipo, explosivoData.id);

  if (!mediaDetails || !mediaDetails.backdrop_path) {
    console.warn("Could not fetch details or backdrop for secicond edestacado section:", explosivoData);
    return null;
  }

  const secicondEdestacadoSection = document.createElement("div");
  secicondEdestacadoSection.className = "adult-featured-section relative w-full h-[30vh] md:h-[40vh] lg:h-[50vh] flex items-center justify-center text-center overflow-hidden rounded-xl shadow-2xl border border-black/50 transform transition-all duration-500 ease-in-out hover:scale-[1.01] group mb-8";
  secicondEdestacadoSection.style.backgroundImage = `url(${globalBackdropBaseUrl}${mediaDetails.backdrop_path})`;
  secicondEdestacadoSection.style.backgroundSize = 'cover';
  secicondEdestacadoSection.style.backgroundPosition = 'center';
  secicondEdestacadoSection.style.backgroundRepeat = 'no-repeat';
  secicondEdestacadoSection.innerHTML = `
    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
    <div class="absolute inset-0 bg-black/30 z-10"></div> <!-- Solid black overlay -->
    <div class="relative z-20 flex flex-col items-center p-2 max-w-2xl mx-auto">
      <span class="inline-flex items-center bg-orange-500 text-white text-sm px-2.5 py-1 rounded-full tracking-wide shadow-lg mb-2">
        <i class="fas fa-star text-sm mr-1.5"></i>  Estreno Destacado
      </span>
      <h2 class="text-2xl md:text-4xl lg:text-5xl text-white leading-tight mb-3 drop-shadow-md">
        ${mediaDetails.title || mediaDetails.name}
      </h2>
      <div class="flex space-x-2">
        <a href="${explosivoData.url}" target="_blank" class="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-full text-xs transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          <i class="fas fa-play-circle mr-1.5"></i> VER AHORA
        </a>
        <a href="https://www.themoviedb.org/${explosivoData.tipo}/${explosivoData.id}" target="_blank" class="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-full text-xs transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          <i class="fas fa-info-circle mr-1.5"></i> MÁS INFORMACIÓN
        </a>
      </div>
    </div>
  `;
  return secicondEdestacadoSection;
}

export async function loadAdultContentSection(allMediaDetails = [], imageBaseUrl) {
  globalAdultMediaDetails = allMediaDetails;
  globalImageBaseUrl = imageBaseUrl;

  const appMainContent = document.getElementById("app-main-content");

  const adultContentTemplate = document.getElementById(
    "adult-content-template"
  );
  if (adultContentTemplate) {
    const contentFragment = adultContentTemplate.content.cloneNode(true);
    appMainContent.appendChild(contentFragment);
    console.log("Adult Content section loaded.");

    // After appending, get references from the main element within the appended content
    const mainElement = appMainContent.querySelector("#main-content");

    const adultHeroSliderSection = mainElement.querySelector(
      "#adult-hero-slider-section"
    );
    const adultPrestigioPlusSection = mainElement.querySelector(
      "#adult-prestigio-plus-section"
    );
    const adultSlidersSection = mainElement.querySelector(
      "#adult-sliders-section"
    );

    // Create and insert "Continuar viendo" section for adult content
    const adultContinueWatchingSection = document.createElement("section");
    adultContinueWatchingSection.id = "adult-continue-watching-section";
    adultContinueWatchingSection.className = "container mx-auto px-4 py-8";
    adultContinueWatchingSection.innerHTML = `
      <div id="progress-content" class="flex flex-col gap-4">
        <!-- Adult progress content will be dynamically loaded here -->
      </div>
    `;
    window.updateProgressSection(adultContinueWatchingSection, true, globalAdultMediaDetails); // Update with adult content and pass globalAdultMediaDetails

    const adultOnlyData = globalAdultMediaDetails.filter(
      (item) => item.isAdult
    );

    // Render Hero Slider for Adult Content
    if (adultHeroSliderSection && adultOnlyData.length > 0) {
      const shuffledAdultContent = [...adultOnlyData].sort(
        () => 0.5 - Math.random()
      );
      const heroItemsToDisplay = shuffledAdultContent.slice(0, 7); // Display up to 7 items in hero slider
      adultHeroSliderSection.innerHTML = "";
      adultHeroSliderSection.appendChild(
        createHeroSlider(globalBackdropBaseUrl, heroItemsToDisplay)
      );
    }

    // Render Prestigio Plus Section for Adult Content
    if (adultPrestigioPlusSection) {
      adultPrestigioPlusSection.innerHTML = ""; // Clear existing content
      adultPrestigioPlusSection.appendChild(createPrestigioPlusSection());

      const isHidePrestigioPlusEnabled = localStorage.getItem("hidePrestigioPlusEnabled") === "true";
      if (window.updateConfiguracionPrestigioPlusVisibility) {
        window.updateConfiguracionPrestigioPlusVisibility("prestigio-plus-adult-link", isHidePrestigioPlusEnabled);
      }
    }

    // Insert the continue watching section after the Prestigio Plus section
    if (adultPrestigioPlusSection && adultContinueWatchingSection) {
      adultPrestigioPlusSection.after(adultContinueWatchingSection);
    }

    // Append Secicond Edestacado section
    const secicondEdestacadoSectionElement = await createSecicondEdestacadoSection(window.secicondEdestacadoContent);
    if (secicondEdestacadoSectionElement) {
      mainElement.insertBefore(secicondEdestacadoSectionElement, adultSlidersSection); // Insert before the general sliders section
    }

    // Featured Adult Content Slider (Destacado) - Moved here as per user request
    const featuredAdultContent = [...adultOnlyData]
      .filter(item => item.categoria.includes("destacado")) // Assuming a 'destacado' category for featured items
      .sort(() => 0.5 - Math.random()) // Shuffle for variety
      .slice(0, 10);
    if (featuredAdultContent.length > 0) {
      const featuredSection = document.createElement("section");
      featuredSection.className = "py-8"; // Add some padding
      featuredSection.innerHTML = `
        <h2 class="text-2xl font-bold text-white mb-4 text-center">Destacado +18</h2>
        <div id="featured-content" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <!-- Featured content will be dynamically loaded here -->
        </div>
      `;
      mainElement.insertBefore(featuredSection, adultSlidersSection); // Insert before the general sliders section

      const featuredContentDiv = featuredSection.querySelector("#featured-content");
      if (featuredContentDiv) {
        featuredContent.forEach(item => {
          // Create a card for each featured item (similar to how createContentSlider does it)
          if (item && (item.poster_path || item.backdrop_path)) {
            const contentCard = document.createElement("div");
            contentCard.className = "flex-shrink-0 relative p-1 poster-card w-full rounded-lg overflow-hidden bg-gray-800 shadow-lg";
            contentCard.style.cursor = "pointer";
            contentCard.addEventListener("click", () => {
              const customUrl = `go:${item.id}`;
              window.open(customUrl, "_self");
            });

            const posterImage = document.createElement("img");
            posterImage.src = globalImageBaseUrl + (item.poster_path || item.backdrop_path);
            posterImage.alt = item.name || item.title;
            posterImage.className = "rounded-lg w-full h-auto object-cover";
            posterImage.loading = "lazy";
            contentCard.appendChild(posterImage);

            const contentTitle = document.createElement("p");
            contentTitle.className = "text-sm mt-2 text-white text-center truncate w-full";
            contentTitle.textContent = item.title || item.name;
            contentCard.appendChild(contentTitle);

            if (item.isAdult) {
              const adultBadge = document.createElement("div");
              adultBadge.className = "adult-badge absolute top-2 right-2";
              adultBadge.textContent = "+18";
              contentCard.appendChild(adultBadge);
            }
            featuredContentDiv.appendChild(contentCard);
          }
        });
      }
    }

    // Render Content Sliders for Adult Content
    if (adultSlidersSection && adultOnlyData.length > 0) {
      adultSlidersSection.innerHTML = "";

      // Latest Episodes Slider for Adult Content (moved to be after Prestigio Plus)
      const adultLatestEpisodes = window.latestEpisodes.filter(item => item.isAdult);
      if (adultLatestEpisodes.length > 0) {
        const detailedAdultLatestEpisodes = await Promise.all(
          adultLatestEpisodes.map(async (item) => {
            const details = await fetchMediaDetails(apiBaseUrl, item.tipo, item.id, item.season, item.episode);
            return details ? {
              ...item,
              ...details,
              series_name: details.series_name || details.name || details.title,
              title: details.episode_name || details.title || details.name // Prioritize episode_name for title
            } : null;
          })
        );
        const validAdultLatestEpisodes = detailedAdultLatestEpisodes.filter(Boolean);
        if (validAdultLatestEpisodes.length > 0) {
          console.log("validAdultLatestEpisodes data for slider:", validAdultLatestEpisodes); // Added console log
          adultSlidersSection.appendChild(
            createLatestEpisodesSlider(globalImageBaseUrl, "Últimos Episodios Agregados +18", validAdultLatestEpisodes, 'text-white', true) // Pass true for isAdultSection
          );
        }
      }

      // Example: Create a "Popular Adult Content" slider
      const popularAdultContent = [...adultOnlyData]
        .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
        .slice(0, 10);
      if (popularAdultContent.length > 0) {
        adultSlidersSection.appendChild(
          createContentSlider(
            globalImageBaseUrl,
            "Contenido +18 Popular",
            popularAdultContent,
            true // Pass true for isAdultSection
          )
        );
      }

      // Example: Create a "New Adult Releases" slider (based on release_date/first_air_date)
      const newAdultReleases = [...adultOnlyData]
        .sort((a, b) => {
          const dateA = new Date(a.release_date || a.first_air_date || 0);
          const dateB = new Date(b.release_date || b.first_air_date || 0);
          return dateB - dateA;
        })
        .slice(0, 10);
      if (newAdultReleases.length > 0) {
        adultSlidersSection.appendChild(
          createContentSlider(
            globalImageBaseUrl,
            "Nuevos Lanzamientos +18",
            newAdultReleases,
            true // Pass true for isAdultSection
          )
        );
      }
    }

    // The grid and search functionality have been removed.
  } else {
    console.error("Adult Content template not found.");
  }
}

// Expose a function to check if adult content is active
window.isAdultContentActive = () => {
  const appMainContent = document.getElementById("app-main-content");
  return appMainContent && appMainContent.querySelector("#adult-content-section") !== null;
};

window.updatePrestigioPlusVisibilityAdult = (hidePrestigioPlus) => {
  if (window.updateConfiguracionPrestigioPlusVisibility) {
    window.updateConfiguracionPrestigioPlusVisibility("prestigio-plus-adult-link", hidePrestigioPlus);
  }
};
