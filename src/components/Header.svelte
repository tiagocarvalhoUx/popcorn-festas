<script>
  import { link, navigate } from "svelte-routing";
  import { favorites } from "../stores/favorites.js";

  let isMenuOpen = false;
  let favoriteCount = 0;

  favorites.subscribe(items => {
    favoriteCount = items.length;
  });

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<header class="sticky top-0 z-50 glass shadow-lg">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <a href="/" use:link class="flex items-center space-x-2" on:click={closeMenu}>
        <img src="/fotos/popcorn-festas-logo.png" alt="PopCorn Festas" class="h-12 w-auto" />
        <span class="hidden sm:block text-xl font-display text-popcorn-red">PopCorn Festas</span>
      </a>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-6">
        <a href="/" use:link class="text-gray-700 hover:text-popcorn-red font-semibold transition-colors">
          Home
        </a>
        <a href="/catalogo" use:link class="text-gray-700 hover:text-popcorn-red font-semibold transition-colors">
          Catálogo
        </a>
        <a href="/construir-festa" use:link class="text-gray-700 hover:text-popcorn-red font-semibold transition-colors">
          Monte sua Festa
        </a>
        <a href="/galeria" use:link class="text-gray-700 hover:text-popcorn-red font-semibold transition-colors">
          Galeria
        </a>
        <a href="/divertido" use:link class="text-gray-700 hover:text-popcorn-red font-semibold transition-colors">
          Diversão
        </a>
        <a href="/orcamento" use:link class="bg-popcorn-red text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors shadow-md">
          Orçamento
        </a>
        
        <!-- Favorites -->
        <a href="/favoritos" use:link class="relative p-2 text-gray-700 hover:text-popcorn-red transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {#if favoriteCount > 0}
            <span class="absolute -top-1 -right-1 bg-popcorn-yellow text-popcorn-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {favoriteCount}
            </span>
          {/if}
        </a>
      </nav>

      <!-- Mobile Menu Button -->
      <button 
        class="md:hidden p-2 rounded-md text-gray-700 hover:text-popcorn-red focus:outline-none"
        on:click={toggleMenu}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {#if isMenuOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Navigation -->
  {#if isMenuOpen}
    <div class="md:hidden glass border-t">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a href="/" use:link class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-popcorn-red hover:bg-red-50" on:click={closeMenu}>
          Home
        </a>
        <a href="/catalogo" use:link class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-popcorn-red hover:bg-red-50" on:click={closeMenu}>
          Catálogo
        </a>
        <a href="/construir-festa" use:link class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-popcorn-red hover:bg-red-50" on:click={closeMenu}>
          Monte sua Festa
        </a>
        <a href="/galeria" use:link class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-popcorn-red hover:bg-red-50" on:click={closeMenu}>
          Galeria
        </a>
        <a href="/divertido" use:link class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-popcorn-red hover:bg-red-50" on:click={closeMenu}>
          Diversão
        </a>
        <a href="/favoritos" use:link class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-popcorn-red hover:bg-red-50" on:click={closeMenu}>
          Favoritos ({favoriteCount})
        </a>
        <a href="/orcamento" use:link class="block px-3 py-2 rounded-md text-base font-medium bg-popcorn-red text-white" on:click={closeMenu}>
          Solicitar Orçamento
        </a>
      </div>
    </div>
  {/if}
</header>
