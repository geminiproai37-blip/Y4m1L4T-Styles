import { setupAboutAndDMCAModals } from './aboutAndDMCA.js';
import { loadAdultContentSection } from './adultContent.js'; // Import the function

window.initConfiguracionPageContent = (appMainContent) => {

  // Save current scroll position
  const currentScrollY = window.scrollY;

  appMainContent.innerHTML = `
    <main id="main-content" class="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-6 lg:p-8 pb-20">
      <div class="max-w-2xl mx-auto px-2 sm:px-4 lg:px-6">

        <div class="bg-slate-800 rounded-xl p-4 mb-6 shadow-lg flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div class="relative">
            <img 
              id="profile-gif"
              src="https://placehold.co/80x80/1e293b/f97316?text=..." 
              alt="Foto de perfil de anime" 
              class="w-20 h-20 rounded-full border-4 border-orange-500 object-cover "
            >
            <span class="material-icons-outlined absolute bottom-0 right-0 bg-orange-400 text-orange-500 rounded-full p-1 text-lg leading-none shadow-lg border-2 border-slate-800">
              star
            </span>
          </div>
          <div class="text-center sm:text-left flex-grow">
            <h2 class="text-xl font-bold">Yami<span class="text-orange-500">Lat</span></h2>
            <p class="text-slate-400 text-sm">Tu portal al mundo del anime.</p>
          </div>
          <div class="flex space-x-2">
            <button id="follow-us-button" class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-1.5 px-3 rounded-md transition-all duration-300 flex items-center space-x-1 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transform hover:-translate-y-0.5 text-sm">
              <span class="material-icons-outlined text-base">local_fire_department</span>
              <span>Síguenos</span>
            </button>
            <button id="support-us-button" class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-1.5 px-3 rounded-md transition-all duration-300 flex items-center space-x-1 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 transform hover:-translate-y-0.5 text-sm">
              <span class="material-icons-outlined text-base">payments</span>
              <span>Apóyanos</span>
            </button>
          </div>
        </div>

        <a href="http://action_noads"  id="prestigio-plus-link" class="block bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 mb-6 shadow-lg flex items-center justify-between cursor-pointer transform hover:scale-[1.01] transition-transform duration-300 ring-1 ring-white/10 hover:ring-white/30">
            <div class="flex items-center space-x-3">
              <span class="material-icons-outlined text-3xl drop-shadow-lg">workspace_premium</span>
              <div>
                <h3 class="text-lg font-bold text-white drop-shadow-md">Únete a Prestigio Plus</h3>
                <p class="text-white/90 text-xs sm:text-sm">Disfruta de una experiencia sin anuncios.</p>
              </div>
            </div>
            <div class="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200">
              <span class="material-icons-outlined text-lg">arrow_forward</span>
            </div>
        </a>

        <div class="bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <h3 class="text-xl font-bold mb-4">Configuración</h3>
          
          <div class="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg mb-4">
            <div class="flex items-center space-x-3">
              <span class="material-icons-outlined text-2xl text-slate-400">no_adult_content</span>
              <div>
                <h4 class="font-semibold text-base">Habilitar Contenido +18<span id="adult-content-status" class="text-sm font-normal text-slate-400 ml-2"></span></h4>
                <p class="text-slate-400 text-xs">Muestra contenido para adultos en la aplicación.</p>
              </div>
            </div>
            
            <label for="adult-content-toggle" class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" id="adult-content-toggle" class="sr-only peer">
              <div class="w-12 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          <div class="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg mb-4">
            <div class="flex items-center space-x-3">
              <span class="material-icons-outlined text-2xl text-slate-400">visibility_off</span>
              <div>
                <h4 class="font-semibold text-base">Ocultar Adquisición Prestigio Plus<span id="hide-prestigio-plus-status" class="text-sm font-normal text-slate-400 ml-2"></span></h4>
                <p class="text-slate-400 text-xs">Oculta los elementos de Prestigio Plus en la aplicación.</p>
              </div>
            </div>
            
            <label for="hide-prestigio-plus-toggle" class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" id="hide-prestigio-plus-toggle" class="sr-only peer">
              <div class="w-12 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          <div class="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
            <div class="flex items-center space-x-3">
              <span class="material-icons-outlined text-2xl text-slate-400">check_circle_outline</span>
              <div>
                <h4 class="font-semibold text-base">Marcado de Visto Automático<span id="auto-view-status" class="text-sm font-normal text-slate-400 ml-2"></span></h4>
                <p class="text-slate-400 text-xs">Marca automáticamente los capítulos como vistos al reproducirlos.</p>
              </div>
            </div>
            
            <label for="auto-view-toggle" class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" id="auto-view-toggle" class="sr-only peer">
              <div class="w-12 h-7 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

        </div>

        <button id="about-button" class="block bg-slate-800 rounded-xl p-4 sm:p-6 mt-6 mb-6 shadow-lg flex w-full cursor-pointer transform hover:scale-[1.01] transition-transform duration-300 ring-1 ring-white/10 hover:ring-white/30">
            <div class="flex items-center justify-center space-x-3 w-full">
              <span class="material-icons-outlined text-2xl text-slate-400">info</span>
              <div class="text-center">
                <h3 class="text-lg font-bold text-white drop-shadow-md">Acerca de la aplicación</h3>
                <p class="text-white/90 text-xs sm:text-sm">Información sobre la versión y funciones.</p>
              </div>
            </div>
        </button>

        <button id="dmca-button" class="block bg-slate-800 rounded-xl p-4 sm:p-6 mt-6 mb-6 shadow-lg flex w-full cursor-pointer transform hover:scale-[1.01] transition-transform duration-300 ring-1 ring-white/10 hover:ring-white/30">
            <div class="flex items-center justify-center space-x-3 w-full">
              <span class="material-icons-outlined text-2xl text-slate-400">gavel</span>
              <div class="text-center">
                <h3 class="text-lg font-bold text-white drop-shadow-md">DMCA</h3>
                <p class="text-white/90 text-xs sm:text-sm">Información sobre derechos de autor.</p>
              </div>
            </div>
        </button>

        <button id="official-website-button" class="block bg-slate-800 rounded-xl p-4 sm:p-6 mt-6 mb-6 shadow-lg flex w-full cursor-pointer transform hover:scale-[1.01] transition-transform duration-300 ring-1 ring-white/10 hover:ring-white/30">
            <div class="flex items-center justify-center space-x-3 w-full">
              <span class="material-icons-outlined text-2xl text-slate-400">public</span>
              <div class="text-center">
                <h3 class="text-lg font-bold text-white drop-shadow-md">Web Oficial</h3>
                <p class="text-white/90 text-xs sm:text-sm">Visita nuestra página web oficial.</p>
              </div>
            </div>
        </button>

      </div>
    </main>

    <!-- Adult Content Warning Modal -->
    <div id="adult-content-warning-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1000] hidden">
      <div class="bg-slate-800 p-6 rounded-lg shadow-xl max-w-xs mx-auto text-center">
        <h3 class="text-xl font-bold text-white mb-4">Advertencia de Contenido +18</h3>
        <p class="text-slate-300 mb-6">Al habilitar Contenido +18, aceptas que verás material para adultos que puede contener escenas sensibles o explícitas. ¿Estás seguro de que deseas continuar?</p>
        <div class="flex justify-center space-x-4">
          <button id="confirm-adult-content" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Aceptar
          </button>
          <button id="cancel-adult-content" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Hide Prestigio Plus Warning Modal -->
    <div id="hide-prestigio-plus-warning-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1000] hidden">
      <div class="bg-slate-800 p-6 rounded-lg shadow-xl max-w-xs mx-auto text-center">
        <h3 class="text-xl font-bold text-white mb-4">Advertencia: Ocultar Prestigio Plus</h3>
        <p class="text-slate-300 mb-6">Al ocultar Prestigio Plus, no verás las opciones para unirte o las ventajas de una experiencia sin anuncios. ¿Estás seguro de que deseas continuar?</p>
        <div class="flex justify-center space-x-4">
          <button id="confirm-hide-prestigio-plus" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Aceptar
          </button>
          <button id="cancel-hide-prestigio-plus" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Auto View Warning Modal -->
    <div id="auto-view-warning-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1000] hidden">
      <div class="bg-slate-800 p-6 rounded-lg shadow-xl max-w-xs mx-auto text-center">
        <h3 class="text-xl font-bold text-white mb-4">Advertencia: Marcado de Visto Automático</h3>
        <p class="text-slate-300 mb-6">Al habilitar el Marcado de Visto Automático, los capítulos se marcarán como vistos automáticamente al reproducirlos. ¿Estás seguro de que deseas continuar?</p>
        <div class="flex justify-center space-x-4">
          <button id="confirm-auto-view" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Aceptar
          </button>
          <button id="cancel-auto-view" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `;

  const loadProfileGif = async () => {
    const profileImage = document.getElementById("profile-gif");
    if (!profileImage) return;

    const staticGifUrl =
      "https://cdn.jsdelivr.net/gh/Y4m1L4T-Styles/appstyles-anime@commit/gifs/log-user.webp";

    profileImage.src = staticGifUrl;
  };

  const setupAdultContentToggle = () => {
    const toggle = document.getElementById("adult-content-toggle");
    if (!toggle) return;

    const isAdultContentEnabled =
      localStorage.getItem("adultContentEnabled") === "true";
    toggle.checked = isAdultContentEnabled;

    const statusElement = document.getElementById("adult-content-status");

    const updateStatusText = (isEnabled) => {
      if (statusElement) {
        statusElement.textContent = isEnabled ? "Activado" : "Desactivado";
        statusElement.className = isEnabled
          ? "text-sm font-bold text-green-400 ml-2"
          : "text-sm font-bold text-red-400 ml-2";
      }
    };

    updateStatusText(isAdultContentEnabled);

    const adultContentWarningModal = document.getElementById("adult-content-warning-modal");
    const confirmAdultContentButton = document.getElementById("confirm-adult-content");
    const cancelAdultContentButton = document.getElementById("cancel-adult-content");

    toggle.addEventListener("change", (event) => {
      const isEnabled = event.target.checked;

      if (isEnabled) {
        if (adultContentWarningModal) {
          adultContentWarningModal.classList.remove("hidden");
        }

        const handleConfirm = () => {
          localStorage.setItem("adultContentEnabled", true);
          updateStatusText(true);
          if (window.updateNavigationBarVisibility) {
            window.updateNavigationBarVisibility();
          }
          if (adultContentWarningModal) {
            adultContentWarningModal.classList.add("hidden");
          }
          // Call refreshMainContentDisplay to re-render all relevant sections
          if (window.refreshMainContentDisplay) {
            window.refreshMainContentDisplay(true);
          }
          confirmAdultContentButton.removeEventListener("click", handleConfirm);
          cancelAdultContentButton.removeEventListener("click", handleCancel);
        };

        const handleCancel = () => {
          event.target.checked = false; // Revert toggle state
          localStorage.setItem("adultContentEnabled", false);
          updateStatusText(false);
          if (window.updateNavigationBarVisibility) {
            window.updateNavigationBarVisibility();
          }
          if (adultContentWarningModal) {
            adultContentWarningModal.classList.add("hidden");
          }
          // Call refreshMainContentDisplay to re-render all relevant sections
          if (window.refreshMainContentDisplay) {
            window.refreshMainContentDisplay(false);
          }
          confirmAdultContentButton.removeEventListener("click", handleConfirm);
          cancelAdultContentButton.removeEventListener("click", handleCancel);
        };

        confirmAdultContentButton.addEventListener("click", handleConfirm);
        cancelAdultContentButton.addEventListener("click", handleCancel);

      } else {
        localStorage.setItem("adultContentEnabled", isEnabled);
        updateStatusText(isEnabled);
        if (window.updateNavigationBarVisibility) {
          window.updateNavigationBarVisibility();
        }
        // Call refreshMainContentDisplay to re-render all relevant sections
        if (window.refreshMainContentDisplay) {
          window.refreshMainContentDisplay(isEnabled);
        }
      }
    });
  };

  loadProfileGif();
  setupAdultContentToggle();

  const setupHidePrestigioPlusToggle = () => {
    const toggle = document.getElementById("hide-prestigio-plus-toggle");
    if (!toggle) return;

    const isHidePrestigioPlusEnabled =
      localStorage.getItem("hidePrestigioPlusEnabled") === "true";
    toggle.checked = isHidePrestigioPlusEnabled;

    const statusElement = document.getElementById("hide-prestigio-plus-status");

    const updateStatusText = (isEnabled) => {
      if (statusElement) {
        statusElement.textContent = isEnabled ? "Activado" : "Desactivado";
        statusElement.className = isEnabled
          ? "text-sm font-bold text-green-400 ml-2"
          : "text-sm font-bold text-red-400 ml-2";
      }
    };

    updateStatusText(isHidePrestigioPlusEnabled);

    // Set initial visibility of Prestigio Plus link
    window.updateConfiguracionPrestigioPlusVisibility("prestigio-plus-link", isHidePrestigioPlusEnabled);

    const hidePrestigioPlusWarningModal = document.getElementById("hide-prestigio-plus-warning-modal");
    const confirmHidePrestigioPlusButton = document.getElementById("confirm-hide-prestigio-plus");
    const cancelHidePrestigioPlusButton = document.getElementById("cancel-hide-prestigio-plus");

    toggle.addEventListener("change", (event) => {
      const isEnabled = event.target.checked;

      if (isEnabled) {
        if (hidePrestigioPlusWarningModal) {
          hidePrestigioPlusWarningModal.classList.remove("hidden");
        }

        const handleConfirm = () => {
          localStorage.setItem("hidePrestigioPlusEnabled", true);
          updateStatusText(true);
          if (window.updateConfiguracionPrestigioPlusVisibility) {
            window.updateConfiguracionPrestigioPlusVisibility("prestigio-plus-link", true);
          }
          if (window.updatePrestigioPlusVisibilityHome) {
            window.updatePrestigioPlusVisibilityHome(true);
          }
          if (window.updatePrestigioPlusVisibilityAdult) {
            window.updatePrestigioPlusVisibilityAdult(true);
          }
          if (window.updatePrestigioPlusVisibility) {
            window.updatePrestigioPlusVisibility();
          }
          if (hidePrestigioPlusWarningModal) {
            hidePrestigioPlusWarningModal.classList.add("hidden");
          }
          confirmHidePrestigioPlusButton.removeEventListener("click", handleConfirm);
          cancelHidePrestigioPlusButton.removeEventListener("click", handleCancel);
        };

        const handleCancel = () => {
          event.target.checked = false; // Revert toggle state
          localStorage.setItem("hidePrestigioPlusEnabled", false);
          updateStatusText(false);
          if (window.updateConfiguracionPrestigioPlusVisibility) {
            window.updateConfiguracionPrestigioPlusVisibility("prestigio-plus-link", false);
          }
          if (window.updatePrestigioPlusVisibilityHome) {
            window.updatePrestigioPlusVisibilityHome(false);
          }
          if (window.updatePrestigioPlusVisibilityAdult) {
            window.updatePrestigioPlusVisibilityAdult(false);
          }
          if (window.updatePrestigioPlusVisibility) {
            window.updatePrestigioPlusVisibility();
          }
          if (hidePrestigioPlusWarningModal) {
            hidePrestigioPlusWarningModal.classList.add("hidden");
          }
          confirmHidePrestigioPlusButton.removeEventListener("click", handleConfirm);
          cancelHidePrestigioPlusButton.removeEventListener("click", handleCancel);
        };

        confirmHidePrestigioPlusButton.addEventListener("click", handleConfirm);
        cancelHidePrestigioPlusButton.addEventListener("click", handleCancel);

      } else {
        localStorage.setItem("hidePrestigioPlusEnabled", isEnabled);
        updateStatusText(isEnabled);
        if (window.updateConfiguracionPrestigioPlusVisibility) {
          window.updateConfiguracionPrestigioPlusVisibility("prestigio-plus-link", isEnabled);
        }
        if (window.updatePrestigioPlusVisibilityHome) {
          window.updatePrestigioPlusVisibilityHome(isEnabled);
        }
        if (window.updatePrestigioPlusVisibilityAdult) {
          window.updatePrestigioPlusVisibilityAdult(isEnabled);
        }
        if (window.updatePrestigioPlusVisibility) {
          window.updatePrestigioPlusVisibility();
        }
      }
    });
  };

  setupHidePrestigioPlusToggle();

  const setupAutoViewToggle = () => {
    const toggle = document.getElementById("auto-view-toggle");
    if (!toggle) return;

    const isAutoViewEnabled = localStorage.getItem("autoViewEnabled") === "true";
    toggle.checked = isAutoViewEnabled;

    const statusElement = document.getElementById("auto-view-status");

    const updateStatusText = (isEnabled) => {
      if (statusElement) {
        statusElement.textContent = isEnabled ? "Activado" : "Desactivado";
        statusElement.className = isEnabled
          ? "text-sm font-bold text-green-400 ml-2"
          : "text-sm font-bold text-red-400 ml-2";
      }
    };

    updateStatusText(isAutoViewEnabled);

    const autoViewWarningModal = document.getElementById("auto-view-warning-modal");
    const confirmAutoViewButton = document.getElementById("confirm-auto-view");
    const cancelAutoViewButton = document.getElementById("cancel-auto-view");

    toggle.addEventListener("change", (event) => {
      const isEnabled = event.target.checked;

      if (isEnabled) {
        if (autoViewWarningModal) {
          autoViewWarningModal.classList.remove("hidden");
        }

        const handleConfirm = () => {
          localStorage.setItem("autoViewEnabled", true);
          updateStatusText(true);
          if (autoViewWarningModal) {
            autoViewWarningModal.classList.add("hidden");
          }
          confirmAutoViewButton.removeEventListener("click", handleConfirm);
          cancelAutoViewButton.removeEventListener("click", handleCancel);
        };

        const handleCancel = () => {
          event.target.checked = false; // Revert toggle state
          localStorage.setItem("autoViewEnabled", false);
          updateStatusText(false);
          if (autoViewWarningModal) {
            autoViewWarningModal.classList.add("hidden");
          }
          confirmAutoViewButton.removeEventListener("click", handleConfirm);
          cancelAutoViewButton.removeEventListener("click", handleCancel);
        };

        confirmAutoViewButton.addEventListener("click", handleConfirm);
        cancelAutoViewButton.addEventListener("click", handleCancel);

      } else {
        localStorage.setItem("autoViewEnabled", isEnabled);
        updateStatusText(isEnabled);
      }
    });
  };

  setupAutoViewToggle();

  const setupFollowUsButton = () => {
    const followUsButton = document.getElementById("follow-us-button");
    if (!followUsButton) return;

    followUsButton.addEventListener("click", () => {
      window.open("https://www.tiktok.com/@yamilatteam", "_blank");
    });
  };

  setupFollowUsButton();
  setupSupportUsButton();
  setupAboutAndDMCAModals();
  setupOfficialWebsiteButton();

  // Restore scroll position
  window.scrollTo(0, currentScrollY);
};

const setupOfficialWebsiteButton = () => {
  const officialWebsiteButton = document.getElementById("official-website-button");
  if (!officialWebsiteButton) return;

  officialWebsiteButton.addEventListener("click", () => {
    window.open("https://yamilat.blogspot.com/", "_blank"); // Replace with your official website URL
  });
};

const setupSupportUsButton = () => {
  const supportUsButton = document.getElementById("support-us-button");
  if (!supportUsButton) return;

  const supportModalHtml = `
    <div id="support-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1000] hidden">
      <div class="bg-slate-800 p-6 rounded-lg shadow-xl max-w-xs mx-auto text-center">
        <h3 class="text-xl font-bold text-white mb-4">Apoya a YamiLat</h3>
        <p class="text-slate-300 mb-6">Elige cómo quieres apoyar nuestro proyecto:</p>
        <div class="flex flex-col space-y-4">
          <button id="donate-button" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <span class="material-icons-outlined">volunteer_activism</span>
            <span>Donar</span>
          </button>
          <button id="watch-ads-button" class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <span class="material-icons-outlined">play_circle_outline</span>
            <span>Ver Anuncios</span>
          </button>
          <button id="close-support-modal" class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-4">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  `;

  // Append modal HTML to the body if it doesn't exist
  if (!document.getElementById("support-modal")) {
    document.body.insertAdjacentHTML('beforeend', supportModalHtml);
  }

  const supportModal = document.getElementById("support-modal");
  const donateButton = document.getElementById("donate-button");
  const watchAdsButton = document.getElementById("watch-ads-button");
  const closeSupportModalButton = document.getElementById("close-support-modal");

  supportUsButton.addEventListener("click", () => {
    if (supportModal) supportModal.classList.remove("hidden");
  });

  if (closeSupportModalButton) {
    closeSupportModalButton.addEventListener("click", () => {
      if (supportModal) supportModal.classList.add("hidden");
    });
  }

  if (donateButton) {
    donateButton.addEventListener("click", () => {
      window.location.href = "go:donar"; // Specific URL for donations
      if (supportModal) supportModal.classList.add("hidden");
    });
  }

  if (watchAdsButton) {
    watchAdsButton.addEventListener("click", () => {
      window.location.href = "go:ads"; // Specific URL for watching ads
      if (supportModal) supportModal.classList.add("hidden");
    });
  }
};

window.updateConfiguracionPrestigioPlusVisibility = (elementId, hidePrestigioPlus) => {
  const prestigioPlusLink = document.getElementById(elementId);
  if (prestigioPlusLink) {
    prestigioPlusLink.classList.toggle("hidden", hidePrestigioPlus);
  }
};
