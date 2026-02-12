<script>
  import { link } from "svelte-routing";
  import { servicos } from "../data/servicos.js";
  import { favorites, toggleFavorite } from "../stores/favorites.js";

  let selectedCategory = "todos";
  let searchQuery = "";
  let selectedService = null;
  let favoriteIds = [];

  favorites.subscribe(items => {
    favoriteIds = items;
  });

  $: filteredServices = servicos.filter(s => {
    const matchesCategory = selectedCategory === "todos" || s.categoria === selectedCategory;
    const matchesSearch = s.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.descricao.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function openServiceModal(servico) {
    selectedService = servico;
  }

  function closeModal() {
    selectedService = null;
  }

  function isVideo(url) {
    return url.endsWith('.mp4') || url.endsWith('.webm');
  }
</script>

<div class="min-h-screen py-8 px-4">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-display text-popcorn-red mb-4">
        Nosso Catálogo 🎪
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Explore todos os nossos serviços e escolha os melhores para sua festa!
      </p>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <input
              type="text"
              placeholder="Buscar serviços..."
              bind:value={searchQuery}
              class="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-popcorn-red focus:outline-none transition-colors"
            />
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Category Filter -->
        <div class="flex gap-2 flex-wrap">
          <button
            class="px-4 py-2 rounded-full font-semibold transition-all {selectedCategory === 'todos' ? 'bg-popcorn-red text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
            on:click={() => selectedCategory = 'todos'}
          >
            Todos
          </button>
          <button
            class="px-4 py-2 rounded-full font-semibold transition-all {selectedCategory === 'gastronomia' ? 'bg-popcorn-red text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
            on:click={() => selectedCategory = 'gastronomia'}
          >
            🍽️ Gastronomia
          </button>
          <button
            class="px-4 py-2 rounded-full font-semibold transition-all {selectedCategory === 'diversao' ? 'bg-popcorn-red text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
            on:click={() => selectedCategory = 'diversao'}
          >
            🎮 Diversão
          </button>
        </div>
      </div>
    </div>

    <!-- Results Count -->
    <p class="text-gray-600 mb-6">
      {filteredServices.length} serviço{filteredServices.length !== 1 ? 's' : ''} encontrado{filteredServices.length !== 1 ? 's' : ''}
    </p>

    <!-- Services Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each filteredServices as servico}
        <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
          <!-- Image -->
          <div class="relative h-56 overflow-hidden bg-gray-100 flex items-center justify-center">
            <img
              src={servico.imagem}
              alt={servico.nome}
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              on:error={(e) => { e.target.src = '/popcorn-festas-logo.png'; }}
            />
            <div class="absolute top-4 right-4">
              <button
                on:click={() => toggleFavorite(servico.id)}
                class="p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all transform hover:scale-110"
              >
                <svg class="h-6 w-6 {favoriteIds.includes(servico.id) ? 'text-red-500 fill-current' : 'text-gray-400'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <span class="text-white text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                {servico.categoria === 'gastronomia' ? '🍽️ Gastronomia' : '🎮 Diversão'}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <h3 class="text-xl font-display text-gray-800 mb-2">{servico.nome}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{servico.descricao}</p>
            
            <!-- Highlights -->
            <div class="mb-4">
              <ul class="space-y-1">
                {#each servico.destaques.slice(0, 2) as destaque}
                  <li class="flex items-start space-x-2 text-sm text-gray-600">
                    <span class="text-green-500">✓</span>
                    <span>{destaque}</span>
                  </li>
                {/each}
              </ul>
            </div>

            <!-- Price -->
            <div class="flex items-center justify-between">
              <div>
                <span class="text-2xl font-bold text-popcorn-red">
                  R$ {servico.preco.toLocaleString('pt-BR')}
                </span>
                <span class="text-gray-500 text-sm">/{servico.unidade}</span>
              </div>
              <button
                on:click={() => openServiceModal(servico)}
                class="bg-popcorn-red text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors"
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Empty State -->
    {#if filteredServices.length === 0}
      <div class="text-center py-16">
        <span class="text-6xl">🔍</span>
        <h3 class="text-2xl font-display text-gray-800 mt-4">Nenhum serviço encontrado</h3>
        <p class="text-gray-600 mt-2">Tente ajustar seus filtros ou buscar por outro termo.</p>
        <button
          on:click={() => { selectedCategory = 'todos'; searchQuery = ''; }}
          class="mt-4 bg-popcorn-red text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors"
        >
          Limpar Filtros
        </button>
      </div>
    {/if}
  </div>
</div>

<!-- Modal -->
{#if selectedService}
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-900/75 transition-opacity" aria-hidden="true" on:click={closeModal}></div>

      <!-- Modal panel -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="relative">
          <!-- Close button -->
          <button
            on:click={closeModal}
            class="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <svg class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="grid md:grid-cols-2">
            <!-- Left: Image and Gallery -->
            <div class="bg-gray-100 p-6 flex flex-col items-center">
              <img
                src={selectedService.imagem}
                alt={selectedService.nome}
                class="w-full h-64 object-contain rounded-2xl shadow-lg mb-4 bg-white"
                on:error={(e) => { e.target.src = '/popcorn-festas-logo.png'; }}
              />
              {#if selectedService.galeria.length > 0}
                <div class="grid grid-cols-3 gap-2">
                  {#each selectedService.galeria as item}
                    {#if isVideo(item)}
                      <video class="w-full h-20 object-cover rounded-lg" controls muted loop>
                        <source src={item} type="video/mp4">
                      </video>
                    {:else}
                      <img src={item} alt="" class="w-full h-20 object-cover rounded-lg" />
                    {/if}
                  {/each}
                </div>
              {/if}
            </div>

            <!-- Right: Details -->
            <div class="p-8">
              <h2 class="text-3xl font-display text-gray-800 mb-4">{selectedService.nome}</h2>
              <p class="text-gray-600 mb-6">{selectedService.descricao}</p>

              <!-- Highlights -->
              <div class="mb-6">
                <h3 class="font-semibold text-gray-800 mb-3">Destaques:</h3>
                <ul class="space-y-2">
                  {#each selectedService.destaques as destaque}
                    <li class="flex items-start space-x-2">
                      <span class="text-green-500 mt-1">✓</span>
                      <span class="text-gray-600">{destaque}</span>
                    </li>
                  {/each}
                </ul>
              </div>

              <!-- Tags -->
              <div class="mb-6">
                <div class="flex flex-wrap gap-2">
                  {#each selectedService.tags as tag}
                    <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      #{tag}
                    </span>
                  {/each}
                </div>
              </div>

              <!-- Price and Actions -->
              <div class="border-t pt-6">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <span class="text-3xl font-bold text-popcorn-red">
                      R$ {selectedService.preco.toLocaleString('pt-BR')}
                    </span>
                    <span class="text-gray-500">/{selectedService.unidade}</span>
                  </div>
                </div>
                <div class="flex gap-3">
                  <a
                    href="/orcamento?servico={selectedService.id}"
                    class="flex-1 bg-popcorn-red text-white py-3 rounded-full font-semibold text-center hover:bg-red-700 transition-colors"
                  >
                    Solicitar Orçamento
                  </a>
                  <button
                    on:click={() => toggleFavorite(selectedService.id)}
                    class="px-4 py-3 rounded-full border-2 {favoriteIds.includes(selectedService.id) ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-600'} hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    <svg class="h-6 w-6 {favoriteIds.includes(selectedService.id) ? 'fill-current' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
