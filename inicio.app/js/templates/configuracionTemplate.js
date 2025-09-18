export const configuracionTemplate = `
<div class="min-h-screen bg-gray-900 text-white">
  <!-- Navbar will be loaded here -->
  <nav id="navbar-placeholder"></nav>

  <main class="container mx-auto p-4 pb-20">
    <h2 class="text-3xl font-bold text-center mb-8 text-vibrant-orange">
      Ajustes de Sección
    </h2>
    <div class="bg-gray-800 rounded-lg shadow-lg p-6">
      <div class="flex flex-col items-center mb-8">
        <img
          src="https://via.placeholder.com/150"
          alt="User Avatar"
          class="w-24 h-24 rounded-full object-cover mb-4 border-4 border-vibrant-orange"
        />
        <h3 class="text-xl font-semibold text-white">
          Nombre de Usuario
        </h3>
      </div>

      <div class="mb-8">
        <h4 class="text-lg font-bold text-vibrant-orange mb-4">
          Volverse VIP
        </h4>
        <p class="text-gray-300 mb-4">
          Desbloquea contenido exclusivo y una experiencia sin anuncios.
        </p>
        <button
          class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
        >
          ¡Hazte VIP ahora!
        </button>
      </div>
    </div>
  </main>
</div>
`;
