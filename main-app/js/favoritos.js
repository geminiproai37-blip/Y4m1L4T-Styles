import { tmdbApiKey } from './config.js';

// --- GESTIÓN DE PESTAÑAS ---
const activateTab = (activeBtn, inactiveBtns, activeContent, inactiveContents) => {
  activeBtn.classList.add('active', 'text-orange-500', 'border-b-2', 'border-orange-500');
  activeBtn.classList.remove('text-gray-400', 'hover:text-white', 'border-transparent');

  inactiveBtns.forEach(btn => {
    btn.classList.remove('active', 'text-orange-500', 'border-b-2', 'border-orange-500');
    btn.classList.add('text-gray-400', 'hover:text-white', 'border-b-2', 'border-transparent');
  });

  activeContent.classList.remove('hidden');
  inactiveContents.forEach(content => content.classList.add('hidden'));

  localStorage.setItem('lastActiveFavoriteFilter', activeBtn.dataset.filter);
};

/**
 * Creates an "empty state" message with an animated icon.
 * This provides better user feedback when no favorites are found.
 * @param {string} title - The main message title.
 * @param {string} message - The descriptive sub-message.
 * @returns {HTMLDivElement} - The HTML element for the empty state message.
 */
export function createEmptyStateMessage(title, message) {
  const div = document.createElement('div');
  div.className = 'col-span-full flex flex-col items-center justify-center py-12 text-center opacity-75';
  div.innerHTML = `
    <div class="animate-sad-wobble">
      <svg class="w-24 h-24 text-slate-600 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    </div>
    <p class="text-slate-400 text-lg font-medium">${title}</p>
    <p class="text-slate-500 text-sm mt-1">${message}</p>
  `;
  return div;
}

/**
 * Fetches details from TMDB and creates a display card for a favorite item.
 * @param {object} item - The favorite item object from LocalStorage.
 * @returns {Promise<HTMLDivElement>} - A promise that resolves to the HTML card element.
 */
async function createFavoriteCard(item) {
  const mediaType = item.type === 'movie' ? 'movie' : 'tv';
  const tmdbUrl = `https://api.themoviedb.org/3/${mediaType}/${item.id}?api_key=${tmdbApiKey}&language=es-ES`;

  let posterPath = '';
  let title = item.title || item.name || 'Título Desconocido'; // Fallback for title

  try {
    const response = await fetch(tmdbUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    posterPath = data.poster_path;
    title = data.title || data.name; // Update title with fetched data for accuracy
  } catch (error) {
    console.error(`Error fetching ${mediaType} with ID ${item.id}:`, error);
    posterPath = null; // Ensure a placeholder is used on error
  }

  const imageUrl = posterPath ?
    `${window.imageBaseUrl}${posterPath}` : // Use window.imageBaseUrl
    `
    <div class="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 rounded-lg aspect-[2/3]">
      <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 .552.448 1 1 1h14c.552 0 1-.448 1-1V7m-4 4l-4 4-4-4m8 0V7"></path>
      </svg>
    </div>
    `; // Custom SVG for "No Disponible"

  const div = document.createElement('div');
  div.className = 'relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out group poster-card'; // Added poster-card class
  div.innerHTML = `
    <a href="go:${item.id}" class="block" onclick="event.target.closest('.delete-favorite-btn') ? event.preventDefault() : true"> <!-- Changed to custom URL scheme -->
      ${posterPath ? `<img src="${imageUrl}" alt="Poster de ${title}" class="w-full h-auto object-cover rounded-lg aspect-[2/3]">` : imageUrl}
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
        <p class="text-white text-sm font-semibold">${title}</p>
      </div>
    </a>
    <button class="delete-favorite-btn absolute top-2 right-2 bg-red-600 p-2 rounded-full text-white transition-opacity duration-300 z-10" data-id="${item.id}" data-type="${item.type}" data-title="${title}" aria-label="Eliminar de favoritos">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
    </button>
  `;
  return div;
}

/**
 * Elimina un elemento de la lista de favoritos en LocalStorage y re-renderiza la lista.
 * @param {string} id - El ID del elemento a eliminar.
 * @param {string} type - El tipo del elemento a eliminar ('movie' o 'tv').
 */
const deleteFavorite = (id, type) => {
  let favorites = JSON.parse(localStorage.getItem('yamiLatFavorites')) || [];
  // Use loose equality (==) for the ID to handle potential type mismatch (string vs number)
  favorites = favorites.filter(item => !(item.id == id && item.type === type));
  localStorage.setItem('yamiLatFavorites', JSON.stringify(favorites));
  renderFavorites(localStorage.getItem('lastActiveFavoriteFilter') || 'all'); // Re-render current tab
};

// Función principal para cargar y mostrar todos los favoritos
export const renderFavorites = async (filterType) => {
  const favorites = JSON.parse(localStorage.getItem('yamiLatFavorites')) || [];
  const filteredFavorites =
    filterType === 'all'
      ? favorites
      : favorites.filter(item => item.type === filterType);

  const favoritesContentContainer = document.getElementById('favorites-content-container');
  if (!favoritesContentContainer) {
    console.error('Favorites content container not found.');
    return;
  }

  // Clear all content divs
  favoritesContentContainer.querySelectorAll('.tab-content').forEach(contentDiv => {
    contentDiv.innerHTML = '';
  });

  const targetContentDiv = document.getElementById(`${filterType}-content`);
  if (!targetContentDiv) {
    console.error(`Target content div for filter type ${filterType} not found.`);
    return;
  }

  if (filteredFavorites.length > 0) {
    const favoriteCardPromises = filteredFavorites.map(createFavoriteCard);
    const favoriteCards = await Promise.all(favoriteCardPromises);

    const favoritesGrid = document.createElement('div');
    favoritesGrid.id = 'favorites-grid';
    favoritesGrid.className = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-4';
    favoritesGrid.append(...favoriteCards);
    targetContentDiv.appendChild(favoritesGrid);

  } else {
    targetContentDiv.appendChild(createEmptyStateMessage(
      `Sin ${filterType === 'movie' ? 'Películas' : filterType === 'tv' ? 'Animes' : 'Elementos'} Favoritos`,
      `Aún no has añadido ningún ${filterType === 'movie' ? 'película' : filterType === 'tv' ? 'serie' : 'elemento'} a tu lista.`
    ));
  }
};

/**
 * Inicializa la lógica de la página de favoritos.
 * Debe llamarse después de que la plantilla de favoritos se haya insertado en el DOM.
 */
let itemToDelete = null; // Variable to store the item to be deleted

export const initializeFavoritesPage = () => {
  const allTabBtn = document.getElementById('all-tab-btn');
  const movieTabBtn = document.getElementById('movie-tab-btn');
  const tvTabBtn = document.getElementById('tv-tab-btn');

  const allContent = document.getElementById('all-content');
  const movieContent = document.getElementById('movie-content');
  const tvContent = document.getElementById('tv-content');

  const deleteConfirmationModal = document.getElementById('delete-confirmation-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

  if (!allTabBtn || !movieTabBtn || !tvTabBtn || !allContent || !movieContent || !tvContent || !deleteConfirmationModal || !confirmDeleteBtn || !cancelDeleteBtn) {
    console.error('One or more required elements for favorites page or modal not found. Cannot initialize.');
    console.log({allTabBtn, movieTabBtn, tvTabBtn, allContent, movieContent, tvContent, deleteConfirmationModal, confirmDeleteBtn, cancelDeleteBtn});
    return;
  }

  console.log('Favorites page elements and modal elements found. Initializing event listeners.');

  const filterButtons = [allTabBtn, movieTabBtn, tvTabBtn];
  const contentDivs = [allContent, movieContent, tvContent];

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterType = button.dataset.filter;
      const activeBtn = button;
      const inactiveBtns = filterButtons.filter(btn => btn !== activeBtn);
      const activeContent = document.getElementById(`${filterType}-content`);
      const inactiveContents = contentDivs.filter(content => content !== activeContent);

      activateTab(activeBtn, inactiveBtns, activeContent, inactiveContents);
      renderFavorites(filterType);
    });
  });

  // Event listener for delete buttons (delegated to the document for dynamically added elements)
  document.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.delete-favorite-btn');
    if (deleteButton) {
      event.stopPropagation(); // Prevent the event from bubbling up to the parent <a> tag
      event.preventDefault(); // Prevent any default action (like navigating if it were a link)

      itemToDelete = {
        id: deleteButton.dataset.id,
        type: deleteButton.dataset.type,
        title: deleteButton.dataset.title
      };
      document.getElementById('item-name-to-delete').textContent = itemToDelete.title;
      deleteConfirmationModal.classList.remove('hidden');
    }
  });

  confirmDeleteBtn.addEventListener('click', () => {
    if (itemToDelete) {
      deleteFavorite(itemToDelete.id, itemToDelete.type);
      itemToDelete = null; // Clear the stored item
    }
    deleteConfirmationModal.classList.add('hidden');
  });

  cancelDeleteBtn.addEventListener('click', () => {
    itemToDelete = null; // Clear the stored item
    deleteConfirmationModal.classList.add('hidden');
  });


  const lastActiveFilter = localStorage.getItem('lastActiveFavoriteFilter') || 'all';
  const initialActiveButton = document.getElementById(`${lastActiveFilter}-tab-btn`);
  const initialActiveContent = document.getElementById(`${lastActiveFilter}-content`);
  const initialInactiveButtons = filterButtons.filter(btn => btn !== initialActiveButton);
  const initialInactiveContents = contentDivs.filter(content => content !== initialActiveContent);

  activateTab(initialActiveButton, initialInactiveButtons, initialActiveContent, initialInactiveContents);
  renderFavorites(lastActiveFilter);
};
