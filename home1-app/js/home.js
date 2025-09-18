import { createHeroSlider, createContentSlider, createLatestEpisodesSlider, fetchMediaDetails, fetchOnTheAirTvShows, fetchEndedTvShows } from './script.js';

const backdropBaseUrl = "https://image.tmdb.org/t/p/w780";
const imageBaseUrl = "https://image.tmdb.org/t/p/w500";
const apiBaseUrl = "https://api.themoviedb.org/3";

function injectHomeStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #hero-slider-section {
      position: relative;
      width: 100%;
      height: 60vh; /* Made smaller */
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem; /* Added space below the main slider */
    }

    .hero-slider-item {
      scroll-snap-align: start;
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-size: cover; /* Ensure background image covers the area */
      background-position: center; /* Center the background image */
      background-repeat: no-repeat; /* Do not repeat the background image */
    }

    .hero-slider-container {
      scroll-snap-type: x mandatory;
      overflow-x: auto; /* Changed to auto to allow manual scrolling */
      width: 100%;
      height: 100%;
      -webkit-overflow-scrolling: touch;
    }

    .hero-slider-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .hero-slider-dots {
      position: absolute;
      bottom: 20px; /* Adjust as needed */
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 3;
    }

    .hero-slider-dot {
      width: 10px;
      height: 10px;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .hero-slider-dot.active {
      background-color: #f97316; /* orange-500 */
    }

    .hero-background-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover; /* Changed to cover to fill the space */
      object-position: center; /* Center the content of the image */
      background-color: black; /* Added black background */
      z-index: 0;
    }

    .hero-title-logo {
  height: auto;
  object-fit: contain;
  position: absolute;
  top: 15%; /* Adjusted for better vertical positioning */
  left: 50%;
  transform: translateX(-50%);
  width: 35%; /* Made smaller for all screens */
  max-width: 150px; /* Reduced max width for all screens */
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.05))
    drop-shadow(0 4px 3px rgb(0 0 0 / 0.05));
}

@media (min-width: 480px) {
  .hero-title-logo {
    top: 17%;
    width: 35%;
    max-width: 250px;
  }
}

@media (min-width: 768px) {
  .hero-title-logo {
    top: 20%;
    width: 25%;
    max-width: 300px;
  }
}

@media (min-width: 1024px) {
  .hero-title-logo {
    top: 23%;
    width: 20%;
    max-width: 350px;
  }
}


    .hero-slider-item .gradient-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 0.7) 20%,
        rgba(0, 0, 0, 0.5) 40%,
        transparent 100%
      );
      z-index: 1;
    }

    .hero-content-container {
      position: absolute;
      bottom: 10%; /* Further increased space from the bottom for smaller screens */
      left: 50%; /* Center horizontally */
      transform: translateX(-50%); /* Adjust for true centering */
      z-index: 2;
      max-width: 90%; /* Allow more width for content on smaller screens */
      padding: 0 0.5rem; /* Add some padding */
      display: flex;
      flex-direction: column;
      align-items: center; /* Center content horizontally */
      text-align: center; /* Center text */
    }

    @media (min-width: 768px) {
      /* For medium screens and up */
      .hero-content-container {
        bottom: 12%; /* Further increased space from the bottom for medium screens */
        left: 50%; /* Keep centered */
        transform: translateX(-50%); /* Keep centered */
        max-width: 70%; /* Wider on medium screens */
      }
    }

    @media (min-width: 1024px) {
      /* For large screens and up */
      .hero-content-container {
        max-width: 60%; /* Even wider on large screens */
      }
    }

    .hero-content-container .text-lg {
      /* Target the series text */
      font-size: 0.875rem; /* Smaller font size */
      margin-bottom: 0.5rem; /* Smaller margin */
    }

    .hero-content-container .text-6xl {
      /* Target the title fallback */
      font-size: 2.5rem; /* Smaller font size */
    }



    .hero-metadata {
      display: flex;
      align-items: center;
      margin-top: 0.5rem; /* Smaller margin */
      margin-bottom: 1rem; /* Smaller margin */
      font-size: 0.875rem; /* Smaller font size for metadata */
    }

    .hero-metadata span {
      margin-right: 0.4rem; /* Smaller margin */
      color: #d1d5db; /* gray-300 */
      font-weight: 600;
    }

    .hero-metadata .dot {
      width: 3px; /* Smaller dot */
      height: 3px; /* Smaller dot */
      background-color: #f97316; /* orange-500 */
      border-radius: 50%;
      margin-right: 0.4rem; /* Smaller margin */
    }

    .hero-content-container .line-clamp-3 {
      /* Target description */
      font-size: 0.875rem; /* Smaller font size */
      margin-top: 0.5rem; /* Smaller margin */
      margin-bottom: 1rem; /* Smaller margin */
    }

    .hero-buttons-container {
      display: flex;
      gap: 0.75rem; /* Smaller gap */
      margin-top: 1rem; /* Smaller margin */
      align-items: center;
      justify-content: center; /* Center buttons horizontally */
      width: 100%; /* Ensure it takes full width to center */
    }

    .hero-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.6rem 1.2rem; /* Smaller padding */
      border-radius: 9999px; /* full rounded */
      font-weight: 700;
      transition: all 0.3s ease;
      text-decoration: none; /* Remove underline from links */
      font-size: 0.875rem; /* Smaller font size for buttons */
    }

    .hero-button.play {
      background-color: white;
      color: black;
      padding: 0.4rem 0.6rem; /* Smaller padding */
      border-radius: 0.5rem; /* Rounded corners */
      font-size: 0.75rem; /* Smaller font size */
    }

    .hero-button.play:hover {
      background-color: #d1d5db; /* gray-300 */
    }

    .hero-button.secondary-icon {
      background-color: transparent; /* No background */
      border: none; /* Removed border */
      color: white;
      width: 48px; /* Smaller fixed width for circular buttons */
      height: 48px; /* Smaller fixed height for circular buttons */
      border-radius: 50%; /* Make it circular */
      flex-direction: column; /* Stack icon and text */
      font-size: 0.6rem; /* Smaller font for text */
      padding: 0; /* Remove padding */
    }

    .hero-button.secondary-icon i {
      font-size: 1rem; /* Smaller icon size */
    }

    .hero-button.secondary-icon:hover {
      background-color: rgba(107, 114, 128, 0.2); /* Slight background on hover */
    }

    .hero-button.secondary-icon i {
      margin-bottom: 0.25rem; /* Space between icon and text */
    }
    /* Custom styles for content cards */
    .poster-card {
      width: 90px; /* Smaller fixed width for poster */
      aspect-ratio: 2 / 3; /* Common poster aspect ratio */
    }

    .poster-card img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .episode-card {
      width: 120px; /* Smaller fixed width for 16:9 episode card */
      aspect-ratio: 16 / 9;
    }

    .episode-card img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .rank-overlay {
      /* Position is now handled by Tailwind classes in script.js: absolute top-2 left-2 */
      background-color: #f97316; /* Orange background */
      color: white; /* White text */
      border: none; /* No border */
      padding: 0.3rem 0.7rem; /* Adjusted padding */
      font-size: 2.2rem; /* Significantly increased font size */
      font-weight: bold;
      font-family: "Inter", sans-serif; /* Specific font family */
      border-radius: 0.25rem; /* Rounded square borders */
      z-index: 10;
      text-align: center;
      /* Using multiple text-shadows to simulate a text stroke */
      text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
        1px 1px 0 #000;
      line-height: 1; /* Adjust line height to center text vertically */
      z-index: 40; /* Ensure it's above most content but below a potential fixed navbar */
    }

  `;
  document.head.appendChild(style);
}

function createPrestigioPlusSection() {
  const prestigioPlusSection = document.createElement("div");
  prestigioPlusSection.className = "px-2 sm:px-4 lg:px-6 mb-6";
  prestigioPlusSection.innerHTML = `
    <a href="http://action_noads" id="prestigio-plus-home-link" class="block bg-orange-500 rounded-xl p-4 shadow-lg flex items-center justify-between cursor-pointer transform hover:scale-[1.01] transition-transform duration-300 ring-1 ring-white/10 hover:ring-white/30">
        <div class="flex items-center space-x-3">
          <span class="material-icons-outlined text-3xl drop-shadow-lg text-white">emoji_events</span>
          <div>
            <h3 class="text-lg font-bold text-white drop-shadow-md">Prestigio Plus <span class="ml-2 px-2 py-1 bg-white/30 text-white text-xs font-bold rounded-full">$5</span></h3>
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

async function createExplosivoSection(explosivoData) {
  if (!explosivoData || !explosivoData.active) {
    return null; // Do not create the section if not active
  }

  const mediaDetails = await fetchMediaDetails(apiBaseUrl, explosivoData.tipo, explosivoData.id);

  if (!mediaDetails || !mediaDetails.backdrop_path) {
    console.warn("Could not fetch details or backdrop for explosivo section:", explosivoData);
    return null;
  }

  const explosivoSection = document.createElement("div");
  explosivoSection.className = "relative w-full h-[30vh] md:h-[40vh] lg:h-[50vh] flex items-center justify-center text-center overflow-hidden rounded-xl shadow-2xl border border-black/50 transform transition-all duration-500 ease-in-out hover:scale-[1.01] group mb-8";
  explosivoSection.style.backgroundImage = `url(${backdropBaseUrl}${mediaDetails.backdrop_path})`;
  explosivoSection.style.backgroundSize = 'cover';
  explosivoSection.style.backgroundPosition = 'center';
  explosivoSection.style.backgroundRepeat = 'no-repeat';
  explosivoSection.innerHTML = `
    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10"></div>
    <div class="absolute inset-0 bg-black/30 z-10"></div> <!-- Solid black overlay -->
    <div class="relative z-20 flex flex-col items-center p-2 max-w-2xl mx-auto">
      <span class="inline-flex items-center bg-orange-500 text-white text-sm px-2.5 py-1 rounded-full tracking-wide shadow-lg mb-2">
        <i class="fas fa-star text-sm mr-1.5"></i> Estreno Destacado
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
  return explosivoSection;
}

function buildHomeMainContent() {
  const main = document.createElement("main");
  main.id = "main-content";
  main.className = "";
  main.innerHTML = `
    <section
      id="hero-slider-section"
      class="relative w-full h-[60vh] overflow-hidden"
    >
      <!-- Hero slider will be dynamically loaded here -->
    </section>
    <section id="sliders-section" class="container mx-auto px-4 py-8">
      <!-- Content sliders will be dynamically loaded here -->
    </section>
  `;
  return main;
}

export async function initHome(targetElement) {
  injectHomeStyles();
  // No need to clear targetElement here, handleNavigation does it.
  const mainElement = buildHomeMainContent();
  targetElement.appendChild(mainElement);

  const heroSliderSection = mainElement.querySelector(
    "#hero-slider-section"
  );
  const slidersSection = mainElement.querySelector("#sliders-section");
  slidersSection.innerHTML = "";

  // Append Prestigio Plus section
  const prestigioPlusSection = createPrestigioPlusSection();
  mainElement.insertBefore(prestigioPlusSection, slidersSection);

  // Add home-continue-watching-section
  const homeContinueWatchingSection = document.createElement("section");
  homeContinueWatchingSection.id = "home-continue-watching-section";
  homeContinueWatchingSection.className = "container mx-auto px-4 py-8"; // Add classes for styling
  homeContinueWatchingSection.innerHTML = `
      <div id="progress-content" class="flex flex-col gap-4">
        <!-- Home progress content will be dynamically loaded here -->
      </div>
    `;
  mainElement.insertBefore(homeContinueWatchingSection, slidersSection);

  // Append Explosivo section
  const explosivoSectionElement = await createExplosivoSection(window.explosivoContent);
  if (explosivoSectionElement) {
    mainElement.insertBefore(explosivoSectionElement, slidersSection);
  }

  const isHidePrestigioPlusEnabled = localStorage.getItem("hidePrestigioPlusEnabled") === "true";
  if (window.updateConfiguracionPrestigioPlusVisibility) {
    window.updateConfiguracionPrestigioPlusVisibility("prestigio-plus-home-link", isHidePrestigioPlusEnabled);
  }

  const homeContent = window.allMediaDetails.filter((item) =>
    item.categoria.includes("home")
  );

  // Hero Slider
  const shuffledHomeContent = [...homeContent].sort(() => 0.5 - Math.random());
  const heroItemsToDisplay = shuffledHomeContent.slice(0, 7);
  heroSliderSection.innerHTML = "";
  heroSliderSection.appendChild(
    createHeroSlider(backdropBaseUrl, heroItemsToDisplay)
  );

  // Latest Episodes Slider
  if (window.latestEpisodes) {
    const nonAdultLatestEpisodes = window.latestEpisodes.filter(item => !item.isAdult); // Ensure 'isAdult' property is used
    const detailedLatestEpisodes = await Promise.all(
      nonAdultLatestEpisodes.map(async (item) => {
        const details = await fetchMediaDetails(apiBaseUrl, item.tipo, item.id, item.season, item.episode);
        return details ? { 
          ...item, 
          ...details, 
          series_name: details.series_name || details.name || details.title,
          title: details.episode_name || details.name || details.title // Use episode name as title
        } : null;
      })
    );
    const validLatestEpisodes = detailedLatestEpisodes.filter(Boolean);
    if (validLatestEpisodes.length > 0) {
      console.log("validLatestEpisodes data for home slider:", validLatestEpisodes); // Added console log
      slidersSection.appendChild(
        createLatestEpisodesSlider(imageBaseUrl, "Últimos Episodios Agregados", validLatestEpisodes, 'text-orange-500')
      );
    }
  }

  // Content Sliders
  const categoryTitles = {
    series: "Series de Anime Populares",
    peliculas: "Películas de Anime Peor Calificadas",
    // Add more mappings for other categories if needed
  };

  const allContent = window.allMediaDetails;
  const uniqueCategories = [
    ...new Set(allContent.flatMap((item) => item.categoria)),
  ].filter((cat) => cat !== "home");

  uniqueCategories.forEach((category) => {
    let itemsForCategory = allContent.filter((item) =>
      item.categoria.includes(category)
    );

    if (category === 'peliculas') {
      itemsForCategory.sort((a, b) => a.vote_average - b.vote_average);
    } else if (category === 'series') { // Add sorting for series by popularity
      itemsForCategory.sort((a, b) => b.popularity - a.popularity); // Sort by popularity descending
      // Add rank property based on index
      itemsForCategory = itemsForCategory.map((item, index) => ({
        ...item,
        rank: index + 1
      }));
    }
    
    if (itemsForCategory.length > 0) {
      const title = categoryTitles[category] || `Contenido de ${category}`;
      slidersSection.appendChild(
        createContentSlider(imageBaseUrl, title, itemsForCategory)
      );
    }
  });

  // Update the home continue watching section
  window.updateProgressSection(homeContinueWatchingSection, false);
}

window.updatePrestigioPlusVisibilityHome = (hidePrestigioPlus) => {
  if (window.updateConfiguracionPrestigioPlusVisibility) {
    window.updateConfiguracionPrestigioPlusVisibility("prestigio-plus-home-link", hidePrestigioPlus);
  }
};
