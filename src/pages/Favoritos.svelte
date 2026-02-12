<script>
  import { link } from "svelte-routing";
  import { favorites, toggleFavorite } from "../stores/favorites.js";
  import { servicos } from "../data/servicos.js";
  import { adicionarServico } from "../stores/construtor.js";

  $: favoritosList = $favorites
    .map(id => servicos.find(s => s.id === id))
    .filter(Boolean);

  $: totalFavoritos = favoritosList.reduce((acc, s) => acc + s.preco, 0);

  function addToBuilder(servicoId) {
    adicionarServico(servicoId);
  }

  function addAllToBuilder() {
    $favorites.forEach(id => adicionarServico(id));
  }
</script>

<div class="min-h-screen py-8 px-4">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-display text-popcorn-red mb-4">
        Meus Favoritos ❤️
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Seus serviços favoritos salvos para montar a festa dos seus sonhos!
      </p>
    </div>

    {#if favoritosList.length === 0}
      <!-- Empty State -->
      <div class="text-center py-16">
        <span class="text-8xl">💔</span>
        <h2 class="text-2xl font-display text-gray-800 mt-6 mb-2">
          Nenhum favorito ainda
        </h2>
        <p class="text-gray-600 mb-8">
          Explore nosso catálogo e salve seus serviços favoritos!
        </p>
        <a
          href="/catalogo"
          use:link
          class="inline-block bg-popcorn-red text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transition-colors"
        >
          Explorar Catálogo
        </a>
      </div>
    {:else}
      <!-- Favorites Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {#each favoritosList as servico}
          <div class="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <!-- Image -->
            <div class="relative h-48 overflow-hidden {servico.cores.bg}">
              <img
                src={servico.imagem}
                alt={servico.nome}
                class="w-full h-full object-cover"
              />
              <button
                on:click={() => toggleFavorite(servico.id)}
                class="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all"
              >
                <svg class="h-6 w-6 text-red-500 fill-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
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

              <!-- Price & Actions -->
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-2xl font-bold text-popcorn-red">
                    R$ {servico.preco.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>

              <div class="flex gap-2 mt-4">
                <button
                  on:click={() => addToBuilder(servico.id)}
                  class="flex-1 bg-popcorn-yellow text-popcorn-dark py-2 rounded-full font-semibold hover:bg-yellow-300 transition-colors text-sm"
                >
                  Adicionar à Festa
                </button>
                <a
                  href="/catalogo"
                  use:link
                  class="px-4 py-2 border-2 border-popcorn-red text-popcorn-red rounded-full font-semibold hover:bg-red-50 transition-colors text-sm"
                >
                  Ver
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Summary -->
      <div class="bg-popcorn-dark rounded-3xl p-8 text-white">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 class="text-2xl font-display mb-2">Resumo dos Favoritos</h3>
            <p class="text-gray-400">
              {favoritosList.length} serviço{favoritosList.length !== 1 ? 's' : ''} selecionado{favoritosList.length !== 1 ? 's' : ''}
            </p>
            <p class="text-4xl font-display text-popcorn-yellow mt-4">
              R$ {totalFavoritos.toLocaleString('pt-BR')}
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              on:click={addAllToBuilder}
              class="flex-1 bg-popcorn-yellow text-popcorn-dark px-6 py-4 rounded-full font-bold hover:bg-yellow-300 transition-colors"
            >
              Adicionar Todos à Festa
            </button>
            <a
              href="/orcamento"
              use:link
              class="flex-1 bg-white text-popcorn-red px-6 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors text-center"
            >
              Solicitar Orçamento
            </a>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
