import { buildCard, buildSliderPoster, debounce, showNotification } from "./script.js";
import {
  tmdbApiKey,
  telegramBotToken,
  telegramChatId,
  telegramTopicId,
} from "./config.js";

let selectedContent = null;
let isEpisodeRequest = false;
let hasAnsweredInAppQuestion = false;

// Modal element variables
let requestModal;
let closeModalButton;
let modalSearchInput;
let modalSearchButton;
let tmdbSearchResults;
let nextStepButton;
let submitRequestButton;
let modalStep1;
let modalStep2;
let inAppQuestion;
let inAppYesButton;
let inAppNoButton;
let episodeRequestFields;
let seasonNumberInput;
let episodeNumberInput;
let backToStep1Button;

/**
 * Opens the request content modal.
 */
export function openRequestModal() {
  console.log("openRequestModal called.");
  if (requestModal) {
    requestModal.classList.add("modal-open"); // Add modal-open class
    requestModal.classList.remove("hidden"); // Ensure hidden is removed
    console.log("requestModal should now be visible.");
  } else {
    console.error("requestModal element not found!");
  }
  submitRequestButton.disabled = true;
  nextStepButton.disabled = true;
  nextStepButton.classList.add("opacity-50", "cursor-not-allowed");
  updateSubmitButtonState();
}

/**
 * Searches TMDB for movies and TV shows.
 * @param {string} query The search query.
 * @returns {Promise<Array>} A promise that resolves to an array of search results.
 */
async function searchTmdb(query) {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&query=${encodeURIComponent(
    query
  )}&language=es-ES`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results.filter(
      (item) =>
        (item.media_type === "movie" || item.media_type === "tv") &&
        item.poster_path
    );
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return [];
  }
}

/**
 * Displays TMDB search results in the modal.
 * @param {Array} results The search results from TMDB.
 * @param {IntersectionObserver} observer The observer for lazy loading images.
 */
function displayTmdbResults(results, observer) {
  tmdbSearchResults.innerHTML = "";
  if (results.length === 0) {
    tmdbSearchResults.innerHTML =
      '<p class="text-gray-400 col-span-full text-center">No se encontraron resultados.</p>';
    tmdbSearchResults.classList.add("hidden");
    selectedContent = null;
    nextStepButton.disabled = true;
    nextStepButton.classList.add("opacity-50", "cursor-not-allowed");
    return;
  }
  tmdbSearchResults.classList.remove("hidden");

  results.forEach((item) => {
    const posterUrl = `https://image.tmdb.org/t/p/w185${item.poster_path}`;
    const title = item.media_type === "movie" ? item.title : item.name;
    const releaseDate =
      item.media_type === "movie"
        ? item.release_date
          ? item.release_date.substring(0, 4)
          : ""
        : item.first_air_date
        ? item.first_air_date.substring(0, 4)
        : "";
    const synopsis = item.overview || "Sinopsis no disponible.";

    const resultElement = document.createElement("div");
    resultElement.classList.add(
      "tmdb-result",
      "cursor-pointer",
      "rounded-lg",
      "overflow-hidden",
      "shadow-lg",
      "flex",
      "flex-col",
      "items-center",
      "text-center",
      "bg-gray-700",
      "w-20", /* Smaller width */
      "h-auto" /* Auto height to maintain aspect ratio */
    );

    // Use data-src for lazy loading
    resultElement.innerHTML = `
      <div class="w-full h-32 relative flex-shrink-0"> <!-- Adjusted height for smaller posters -->
        <img data-src="${posterUrl}" alt="${title}" class="lazy-image absolute inset-0 w-full h-full object-cover rounded-lg">
      </div>
    `;

    resultElement.addEventListener("click", () => {
      document.querySelectorAll(".tmdb-result.selected").forEach((el) => {
        el.classList.remove("selected", "border-4", "border-orange-500");
      });
      resultElement.classList.add("selected", "border-4", "border-orange-500");
      selectedContent = {
        poster: posterUrl,
        name: title,
        type: item.media_type === "movie" ? "Película" : "Serie",
        synopsis: synopsis,
        id: item.id,
        media_type: item.media_type,
        tmdb_url: `https://www.themoviedb.org/${item.media_type}/${item.id}`,
      };

      // The preview elements were removed, so these lines are no longer needed.
      // document.getElementById("preview-poster").src = selectedContent.poster;
      // document.getElementById("preview-title").textContent = selectedContent.name;
      // document.getElementById("preview-type").textContent = selectedContent.type;

      nextStepButton.disabled = false;
      nextStepButton.classList.remove("opacity-50", "cursor-not-allowed");
      console.log("Next step button enabled after selection.");
    });
    tmdbSearchResults.appendChild(resultElement);
    
    // Observe the image for lazy loading
    const img = resultElement.querySelector("img");
    if (img) {
      observer.observe(img);
    }
  });
}

/**
 * Updates the state of the submit button based on user input.
 */
function updateSubmitButtonState() {
  if (!hasAnsweredInAppQuestion) {
    submitRequestButton.disabled = true;
  } else if (isEpisodeRequest) {
    const season = parseInt(seasonNumberInput.value);
    const episode = parseInt(episodeNumberInput.value);
    submitRequestButton.disabled = !(season > 0 && episode > 0);
  } else {
    submitRequestButton.disabled = selectedContent === null;
  }

  if (submitRequestButton.disabled) {
    submitRequestButton.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    submitRequestButton.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

/**
 * Sends the request message and poster to Telegram.
 * @param {object} content The selected content details.
 * @param {string} message The message to send.
 * @returns {Promise<boolean>} True if the message was sent successfully, false otherwise.
 */
async function sendToTelegram(content, message) {
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendPhoto`;
  const formData = new FormData();
  formData.append("chat_id", telegramChatId);
  formData.append("photo", content.poster);
  formData.append("caption", message);
  formData.append("parse_mode", "Markdown");
  if (telegramTopicId) {
    formData.append("message_thread_id", telegramTopicId);
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.ok) {
      return true;
    } else {
      console.error("Error sending message to Telegram:", data);
      return false;
    }
  } catch (error) {
    console.error("Network error sending to Telegram:", error);
    return false;
    }
  }

/**
 * Initializes the search page, sets up event listeners, and lazy loading.
 * @param {HTMLElement} appMainContent The main content div to append the buscador page to.
 */
export async function initBuscador(appMainContent) {
  // Inject styles for lazy loading animation
  const style = document.createElement('style');
  style.textContent = `
    .lazy-image {
      opacity: 0;
      transition: opacity 0.4s ease-in-out;
    }
    .lazy-image.loaded {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  // Ensure the modal is hidden by default when the buscador page is initialized
  const existingRequestModal = document.getElementById("request-modal");
  if (existingRequestModal) {
    existingRequestModal.classList.add("hidden");
  }

  // Setup Intersection Observer for Lazy Loading
  const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.onload = () => {
            img.classList.add('loaded');
          };
        }
        observer.unobserve(img); // Stop observing once loaded
      }
    });
  }, { rootMargin: '0px 0px 250px 0px' }); // Load images 250px before they enter the viewport


  const buscadorTemplate = document.getElementById("buscador-template");
  const mainContent = buscadorTemplate.content.cloneNode(true);
  appMainContent.innerHTML = ""; // Clear previous content
  appMainContent.appendChild(mainContent);

  // Append the request-modal-template to app-root
  const requestModalTemplate = document.getElementById("request-modal-template");
  if (requestModalTemplate) {
    const modalContent = requestModalTemplate.content.cloneNode(true);
    document.getElementById("app-root").appendChild(modalContent);
  }

  // Initialize main page elements
  const searchInput = appMainContent.querySelector("#search-input");
  const searchResultsDiv = appMainContent.querySelector("#search-results"); // Renamed to avoid conflict
  const defaultContentSlider = appMainContent.querySelector("#slider-content");
  const searchResultsTitle = appMainContent.querySelector("#search-results-title");
  const recommendedTitle = appMainContent.querySelector("#recommended-title");
  const defaultSliderContainer = appMainContent.querySelector("#default-content-slider");
  const backButton = appMainContent.querySelector("#back-button");
  const addContentButton = appMainContent.querySelector("#add-content-button");

  // Initialize modal elements AFTER it has been appended to the DOM
  requestModal = document.getElementById("request-modal");
  closeModalButton = requestModal.querySelector("#close-modal-btn");
  modalSearchInput = requestModal.querySelector("#modal-search-input");
  modalSearchButton = requestModal.querySelector("#modal-search-button");
  tmdbSearchResults = requestModal.querySelector("#tmdb-search-results");
  nextStepButton = requestModal.querySelector("#next-step-btn");
  submitRequestButton = requestModal.querySelector("#submit-request-btn");
  modalStep1 = requestModal.querySelector("#modal-step-1");
  modalStep2 = requestModal.querySelector("#modal-step-2");
  inAppQuestion = requestModal.querySelector("#in-app-question");
  inAppYesButton = requestModal.querySelector("#in-app-yes-btn");
  inAppNoButton = requestModal.querySelector("#in-app-no-btn");
  episodeRequestFields = requestModal.querySelector("#episode-request-fields");
  seasonNumberInput = requestModal.querySelector("#season-number-input");
  episodeNumberInput = requestModal.querySelector("#episode-number-input");
  backToStep1Button = requestModal.querySelector("#back-to-step-1-btn");

  // Event Listeners for the main search page
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.hash = "#home";
    });
  }

  if (addContentButton) {
    addContentButton.addEventListener("click", openRequestModal);
  }

  // Event Listeners for the modal
  if (closeModalButton) {
    closeModalButton.addEventListener("click", () => {
      requestModal.classList.remove("modal-open"); // Remove modal-open class
      requestModal.classList.add("hidden"); // Add hidden class
      // Reset modal state
      modalStep1.classList.remove("hidden");
      modalStep2.classList.add("hidden");
      inAppQuestion.classList.add("hidden"); // Hide in-app question on close
      episodeRequestFields.classList.add("hidden");
      selectedContent = null;
      isEpisodeRequest = false;
      hasAnsweredInAppQuestion = false;
      modalSearchInput.value = "";
      tmdbSearchResults.innerHTML = "";
      nextStepButton.disabled = true;
      nextStepButton.classList.add("opacity-50", "cursor-not-allowed");
      submitRequestButton.disabled = true;
      submitRequestButton.classList.add("opacity-50", "cursor-not-allowed");
      seasonNumberInput.value = "";
      episodeNumberInput.value = "";
    });
  }

  if (modalSearchInput) {
    // Remove the input event listener for debounce search
    // The search will now only be triggered by the button click
  }

  if (modalSearchButton) {
    modalSearchButton.addEventListener("click", async () => {
      const query = modalSearchInput.value.trim();
      if (query.length > 2) {
        const results = await searchTmdb(query);
        displayTmdbResults(results, lazyLoadObserver);
      } else {
        tmdbSearchResults.innerHTML = '<p class="text-gray-400 col-span-full text-center">Por favor, escribe al menos 3 caracteres para buscar.</p>';
        tmdbSearchResults.classList.remove("hidden");
        selectedContent = null; // Reset selected content
        nextStepButton.disabled = true;
        nextStepButton.classList.add("opacity-50", "cursor-not-allowed");
      }
    });
  }

  if (nextStepButton) {
    nextStepButton.addEventListener("click", () => {
      if (selectedContent) {
        // The preview elements were removed, so these lines are no longer needed.
        // document.getElementById("preview-poster").src = selectedContent.poster;
        // document.getElementById("preview-title").textContent = selectedContent.name;
        // document.getElementById("preview-type").textContent = selectedContent.type;

        modalStep1.classList.add("hidden");
        modalStep2.classList.remove("hidden");

        if (selectedContent.media_type === "movie") {
          isEpisodeRequest = false;
          hasAnsweredInAppQuestion = true; // Automatically answer "No" for movies
          inAppQuestion.classList.add("hidden"); // Hide the question
          episodeRequestFields.classList.add("hidden"); // Ensure episode fields are hidden
        } else {
          isEpisodeRequest = false;
          hasAnsweredInAppQuestion = false;
          inAppQuestion.classList.remove("hidden");
          episodeRequestFields.classList.add("hidden");
        }
        seasonNumberInput.value = "";
        episodeNumberInput.value = "";
        updateSubmitButtonState();
      }
    });
  }

  if (inAppYesButton) {
    inAppYesButton.addEventListener("click", () => {
      isEpisodeRequest = true;
      hasAnsweredInAppQuestion = true;
      inAppQuestion.classList.add("hidden");
      episodeRequestFields.classList.remove("hidden");
      updateSubmitButtonState();
    });
  }

  if (inAppNoButton) {
    inAppNoButton.addEventListener("click", () => {
      isEpisodeRequest = false;
      hasAnsweredInAppQuestion = true;
      inAppQuestion.classList.add("hidden");
      episodeRequestFields.classList.add("hidden");
      updateSubmitButtonState();
    });
  }

  if (seasonNumberInput) {
    seasonNumberInput.addEventListener("input", updateSubmitButtonState);
  }
  if (episodeNumberInput) {
    episodeNumberInput.addEventListener("input", updateSubmitButtonState);
  }

  if (backToStep1Button) {
    backToStep1Button.addEventListener("click", () => {
      modalStep2.classList.add("hidden");
      modalStep1.classList.remove("hidden");
      selectedContent = null;
      nextStepButton.disabled = true;
      nextStepButton.classList.add("opacity-50", "cursor-not-allowed");
      document.querySelectorAll(".tmdb-result.selected").forEach((el) => {
        el.classList.remove("selected", "border-4", "border-orange-500");
      });
      // Reset in-app question and episode fields visibility
      inAppQuestion.classList.add("hidden");
      episodeRequestFields.classList.add("hidden");
      hasAnsweredInAppQuestion = false;
      isEpisodeRequest = false;
      updateSubmitButtonState();
    });
  }

  if (submitRequestButton) {
    submitRequestButton.addEventListener("click", async () => {
      if (!selectedContent) {
        showNotification("Por favor, selecciona un contenido.", "error");
        return;
      }

      let message = `*Nueva solicitud de contenido:*\n\n`;
      message += `*Título:* ${selectedContent.name}\n`;
      message += `*Tipo:* ${selectedContent.type}\n`;
      message += `*TMDB ID:* ${selectedContent.id}\n`;
      message += `*TMDB URL:* ${selectedContent.tmdb_url}\n`;
      message += `*Sinopsis:* ${selectedContent.synopsis}\n`;

      if (isEpisodeRequest) {
        const season = parseInt(seasonNumberInput.value);
        const episode = parseInt(episodeNumberInput.value);
        if (season > 0 && episode > 0) {
          message += `*Temporada solicitada:* ${season}\n`;
          message += `*Episodio solicitado:* ${episode}\n`;
        } else {
          showNotification(
            "Por favor, ingresa números de temporada y episodio válidos.",
            "error"
          );
          return;
        }

      }
      const success = await sendToTelegram(selectedContent, message);

      if (success) {
        showNotification("¡Solicitud enviada con éxito!", "success", "https://cdn.jsdelivr.net/gh/Y4m1L4T-Styles/appstyles-anime@latest/gifs/send.webp");
        requestModal.classList.remove("modal-open");
        requestModal.classList.add("hidden");

        // Reset modal state
        modalStep1.classList.remove("hidden");
        modalStep2.classList.add("hidden");
        inAppQuestion.classList.add("hidden");
        episodeRequestFields.classList.add("hidden");
        selectedContent = null;
        isEpisodeRequest = false;
        hasAnsweredInAppQuestion = false;
        modalSearchInput.value = "";
        tmdbSearchResults.innerHTML = "";
        seasonNumberInput.value = "";
        episodeNumberInput.value = "";
        updateSubmitButtonState();
      } else {
        showNotification(
          "Error al enviar la solicitud. Inténtalo de nuevo.",
          "error"
        );
      }
    });
  }

  const displayResults = (results) => {
    searchResultsDiv.innerHTML = ""; // Use searchResultsDiv
    if (results.length === 0) {
      searchResultsDiv.innerHTML =
        '<p class="text-center text-gray-400 col-span-full">No se encontraron resultados.</p>';
      return;
    }
    results.forEach((item) => {
        const card = buildCard(window.imageBaseUrl, item);
        searchResultsDiv.appendChild(card); // Use searchResultsDiv
        const img = card.querySelector('img');
        if (img) {
            lazyLoadObserver.observe(img);
        }
    });
  };

  let detailedMedia = [];

  const filterContent = (query) => {
    const filteredMedia = detailedMedia.filter((item) => {
      const title =
        item.title || item.name || item.original_title || item.original_name;
      return title && title.toLowerCase().includes(query);
    });
    displayResults(filteredMedia);
  };

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce((event) => {
        const query = event.target.value.toLowerCase();
        const additionalContentContainer = appMainContent.querySelector("#additional-content-container");

        if (query) {
          defaultSliderContainer.classList.add("hidden");
          recommendedTitle.classList.add("hidden");
          searchResultsTitle.classList.remove("hidden");
          if (additionalContentContainer) additionalContentContainer.classList.add("hidden");
          filterContent(query);
        } else {
          defaultSliderContainer.classList.remove("hidden");
          recommendedTitle.classList.remove("hidden");
          searchResultsTitle.classList.add("hidden");
          if (additionalContentContainer) additionalContentContainer.classList.remove("hidden");
          searchResultsDiv.innerHTML = ""; // Use searchResultsDiv
        }
      }, 300)
    );
  }
  
  const recommendedContent = window.allMediaDetails.filter((item) =>
    item.categoria.includes("home") || item.categoria.includes("buscador")
  );

  if (recommendedContent.length > 0) {
    recommendedTitle.classList.remove("hidden");
    fetchDetailsForLocalItems(recommendedContent).then((detailedContent) => {
      detailedContent.forEach((item) => {
          const poster = buildSliderPoster(window.imageBaseUrl, item);
          defaultContentSlider.appendChild(poster);
          const img = poster.querySelector('img');
          if (img) {
              lazyLoadObserver.observe(img);
          }
      });
    });
  }

  // Populate the new container
  const additionalContentContainer = appMainContent.querySelector("#additional-content-container");
  const additionalContentDiv = appMainContent.querySelector("#additional-content");

  async function fetchDetailsForLocalItems(items) {
    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const url = `https://api.themoviedb.org/3/${item.tipo}/${item.id}?api_key=${tmdbApiKey}&language=es-ES`;
        try {
          const response = await fetch(url);
          if (!response.ok) return null;
          const details = await response.json();
          return { ...item, ...details };
        } catch (error) {
          console.error(`Error fetching details for ${item.id}:`, error);
          return null;
        }
      })
    );
    return detailedItems.filter((item) => item !== null);
  }

  detailedMedia = await fetchDetailsForLocalItems(window.allMediaDetails);

  if (additionalContentDiv) {
    const localBuscadorContent = window.allMediaDetails.filter((item) =>
      item.categoria.includes("buscador")
    );

    fetchDetailsForLocalItems(localBuscadorContent).then((detailedContent) => {
      detailedContent.sort(
        (a, b) => (b.vote_average || 0) - (a.vote_average || 0)
      );

      const top5 = detailedContent.slice(0, 5);

      if (top5.length > 0) {
        additionalContentContainer.classList.remove("hidden");
        additionalContentDiv.innerHTML = ""; // Clear previous content
        top5.forEach((item) => {
          const card = buildCard(window.imageBaseUrl, item);
          additionalContentDiv.appendChild(card);
          const img = card.querySelector("img");
          if (img) {
            lazyLoadObserver.observe(img);
          }
        });
      } else {
        additionalContentContainer.classList.add("hidden");
      }
    });
  }
}
