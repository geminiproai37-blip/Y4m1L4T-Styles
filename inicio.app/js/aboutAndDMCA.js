export function setupAboutAndDMCAModals() {
  const appRoot = document.getElementById('app-root');

  const aboutModalTemplate = `
    <div id="about-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 hidden">
      <div class="bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button id="close-about-modal-button" class="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors duration-200">
          <span class="material-icons-outlined">close</span>
        </button>
        <div class="flex flex-col items-center justify-center mb-6">
          <img src="https://cdn.jsdelivr.net/gh//geminiproai37-blip/Y4m1L4T-Styles@latest/img/logo.png" alt="YamiLat Logo" class="w-24 h-24 mb-4">
          <h3 class="text-3xl font-bold text-white text-center">Yami<span class="text-orange-500">Lat</span></h3>
          <p class="text-slate-400 text-sm mt-1">Tu portal al mundo del anime.</p>
        </div>
        <div class="text-slate-300 space-y-4 text-center">
          <p class="text-lg"><strong>Versión:</strong> <span class="text-orange-400">1.0.0</span></p>
          <p class="text-lg"><strong>Desarrollado por:</strong> <span class="text-orange-400">YamiLat Team</span></p>
          <p class="text-md font-semibold mt-6">Funciones principales:</p>
          <ul class="list-disc list-inside ml-4">
            <li>Exploración de anime y series</li>
            <li>Gestión de favoritos</li>
            <li>Contenido para adultos (opcional)</li>
            <li>Búsqueda avanzada</li>
          </ul>
          <p class="text-sm text-slate-400 text-center mt-4">© 2025 YamiLat. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  `;

  const dmcaModalTemplate = `
<div id="dmca-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
  <div class="bg-slate-800 rounded-xl p-6 w-full max-w-lg shadow-2xl relative border border-slate-700">
    <button id="close-dmca-modal-button" class="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors duration-200 z-10">
      <span class="material-icons-outlined">close</span>
    </button>
    <h3 class="text-2xl font-bold text-white mb-4 text-center">Política de Derechos de Autor (DMCA)</h3>
    <div class="text-slate-300 space-y-4 text-sm max-h-[70vh] overflow-y-auto custom-scrollbar pr-3">

      <p>En YamiLat, respetamos los derechos de propiedad intelectual de terceros y cumplimos con la Ley de Derechos de Autor del Milenio Digital (DMCA), cuyo texto se puede consultar en <a href="http://www.copyright.gov/" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:underline">copyright.gov</a>.</p>
      
      <!-- Sección sobre contenido externo -->
      <div class="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
        <h4 class="font-semibold text-white mb-2">Aclaración sobre el Origen del Contenido</h4>
        <p><strong>YamiLat no aloja videos ni archivos multimedia en sus propios servidores.</strong> Nuestra plataforma funciona únicamente como un motor de búsqueda e indexación de contenido disponible públicamente en internet.</p>
        <p>Todos los enlaces a videos o material mostrado en la aplicación provienen de servidores y servicios de terceros como <strong class="font-mono">The Movie Database (TMDB)</strong>, <strong class="font-mono">Archive.org</strong>, <strong class="font-mono">Google Drive</strong>, entre otros.</p>
        <p>No tenemos control sobre el contenido alojado en dichas plataformas. Por lo tanto, cualquier reclamo de derechos de autor debe dirigirse directamente al proveedor o servicio que aloja el material en cuestión.</p>
      </div>

      <p class="mt-4">Si considera que algún enlace indexado en YamiLat dirige a material que infringe derechos de autor, le recomendamos comunicarse con la plataforma de terceros correspondiente para solicitar su eliminación.</p>

      <p class="text-xs text-slate-400 text-center mt-6">© 2025 YamiLat. Todos los derechos reservados.</p>
    </div>
  </div>
</div>



  `;

  // Setup About Modal
  const aboutButton = document.getElementById("about-button");
  if (aboutButton) {
    aboutButton.addEventListener("click", () => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = aboutModalTemplate;
      const modalContent = tempDiv.firstElementChild;
      appRoot.appendChild(modalContent);

      const aboutModal = document.getElementById("about-modal");
      const closeAboutModalButton = document.getElementById("close-about-modal-button");

      if (aboutModal) {
        aboutModal.classList.remove("hidden");
        aboutModal.addEventListener("click", (event) => {
          if (event.target === aboutModal) {
            aboutModal.classList.add("hidden");
            aboutModal.remove();
          }
        });
      }

      if (closeAboutModalButton) {
        closeAboutModalButton.addEventListener("click", () => {
          if (aboutModal) {
            aboutModal.classList.add("hidden");
            aboutModal.remove();
          }
        });
      }
    });
  }

  // Setup DMCA Modal
  const dmcaButton = document.getElementById("dmca-button");
  if (dmcaButton) {
    dmcaButton.addEventListener("click", () => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = dmcaModalTemplate;
      const modalContent = tempDiv.firstElementChild;
      appRoot.appendChild(modalContent);

      const dmcaModal = document.getElementById("dmca-modal");
      const closeDmcaModalButton = document.getElementById("close-dmca-modal-button");

      if (dmcaModal) {
        dmcaModal.classList.remove("hidden");
        dmcaModal.addEventListener("click", (event) => {
          if (event.target === dmcaModal) {
            dmcaModal.classList.add("hidden");
            dmcaModal.remove();
          }
        });
      }

      if (closeDmcaModalButton) {
        closeDmcaModalButton.addEventListener("click", () => {
          if (dmcaModal) {
            dmcaModal.classList.add("hidden");
            dmcaModal.remove();
          }
        });
      }
    });
  }
}
