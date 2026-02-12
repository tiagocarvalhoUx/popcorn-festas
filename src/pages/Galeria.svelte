<script>
  import { onMount } from "svelte";

  let selectedImage = null;
  let selectedFilter = 'todos';

  const imagens = [
    { src: "/fotos/Galeria/foto 01 galeria.png", categoria: "eventos", titulo: "Festa Infantil" },
    { src: "/fotos/Galeria/foto 02 galeria.png", categoria: "eventos", titulo: "Diversão Garantida" },
    { src: "/fotos/Galeria/foto 03 galeria.png", categoria: "gastronomia", titulo: "Pipoca Gourmet" },
    { src: "/fotos/Galeria/foto 04 galeria.png", categoria: "diversao", titulo: "Máquina de Pelúcia" },
    { src: "/fotos/Galeria/foto 05 galeria.png", categoria: "eventos", titulo: "Festa Temática" },
    { src: "/fotos/Galeria/foto 06 galeria.png", categoria: "gastronomia", titulo: "Sorvete Artesanal" },
    { src: "/fotos/Galeria/foto 07 galeria.png", categoria: "diversao", titulo: "Infláveis" },
    { src: "/fotos/Galeria/foto 08 galeria.png", categoria: "eventos", titulo: "Festa Completa" },
    { src: "/fotos/Galeria/foto-patata.png", categoria: "personagens", titulo: "Patati" },
    { src: "/fotos/Galeria/foto-palhaçoalto.png", categoria: "personagens", titulo: "Palhaço Alto" },
    { src: "/fotos/Galeria/foto-pipocaMickey.png", categoria: "gastronomia", titulo: "Pipoca Mickey" },
    { src: "/fotos/Galeria/foto-bolha.png", categoria: "diversao", titulo: "Bubble House" },
    { src: "/fotos/Galeria/maquina-de-bichinho-led.png", categoria: "diversao", titulo: "Máquina de Pelúcia LED" },
    { src: "/fotos/Galeria/sorvete.png", categoria: "gastronomia", titulo: "Sorvete na Máquina" },
    { src: "/fotos/Galeria/sorvete2.png", categoria: "gastronomia", titulo: "Sorvete Premium" },
    { src: "/fotos/Galeria/tempero-maça-doce.png", categoria: "gastronomia", titulo: "Temperos Especiais" },
  ];

  const videos = [
    { src: "/videos/video-disney.mp4", titulo: "Magia Disney" },
    { src: "/videos/video-popcorn.mp4", titulo: "PopCorn Festas" },
    { src: "/videos/maquina-sorvete.mp4", titulo: "Máquina de Sorvete" },
    { src: "/videos/Hot-Dog.mp4", titulo: "Carrinho de Hot Dog" },
    { src: "/videos/Crianças-inflavel.mp4", titulo: "Diversão no Inflável" },
    { src: "/videos/Fazendo-Algodaodoce.mp4", titulo: "Algodão Doce na Hora" },
  ];

  const categorias = [
    { id: 'todos', nome: 'Todos' },
    { id: 'eventos', nome: 'Eventos' },
    { id: 'gastronomia', nome: 'Gastronomia' },
    { id: 'diversao', nome: 'Diversão' },
    { id: 'personagens', nome: 'Personagens' },
  ];

  $: filteredImages = selectedFilter === 'todos' 
    ? imagens 
    : imagens.filter(img => img.categoria === selectedFilter);

  function openModal(img) {
    selectedImage = img;
  }

  function closeModal() {
    selectedImage = null;
  }

  onMount(() => {
    const handleKeydown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="min-h-screen py-8 px-4">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-display text-popcorn-red mb-4">
        Galeria de Inspirações 📸
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Confira momentos especiais das festas que tornamos inesquecíveis!
      </p>
    </div>

    <!-- Filter Buttons -->
    <div class="flex flex-wrap justify-center gap-3 mb-8">
      {#each categorias as cat}
        <button
          class="px-6 py-2 rounded-full font-semibold transition-all {selectedFilter === cat.id ? 'bg-popcorn-red text-white' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'}"
          on:click={() => selectedFilter = cat.id}
        >
          {cat.nome}
        </button>
      {/each}
    </div>

    <!-- Image Gallery -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
      {#each filteredImages as img, i}
        <button
          class="relative group overflow-hidden rounded-2xl aspect-square focus:outline-none focus:ring-4 focus:ring-popcorn-red"
          on:click={() => openModal(img)}
          style="animation-delay: {i * 50}ms"
        >
          <img
            src={img.src}
            alt={img.titulo}
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span class="text-white font-semibold">{img.titulo}</span>
          </div>
        </button>
      {/each}
    </div>

    <!-- Videos Section -->
    <div class="mb-16">
      <h2 class="text-3xl font-display text-gray-800 mb-8 text-center">Vídeos 🎬</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each videos as video}
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <video
              controls
              class="w-full aspect-video object-cover"
              poster="/fotos/popcorn-festas-logo.png"
              aria-label={video.titulo}
            >
              <source src={video.src} type="video/mp4" />
              <track kind="captions" src="" label="Português" />
              Seu navegador não suporta vídeos.
            </video>
            <div class="p-4">
              <h3 class="font-semibold text-gray-800">{video.titulo}</h3>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gradient-festive rounded-3xl p-8 text-center text-white">
      <h2 class="text-3xl font-display mb-4">Quer ver sua festa aqui? 🎉</h2>
      <p class="text-xl mb-6 opacity-90">
        Compartilhe fotos e vídeos do seu evento com a PopCorn Festas!
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="https://instagram.com"
          target="_blank"
          class="bg-white text-popcorn-red px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
        >
          Seguir no Instagram
        </a>
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          class="bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-colors"
        >
          Enviar Fotos
        </a>
      </div>
    </div>
  </div>
</div>

<!-- Modal -->
{#if selectedImage}
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-black/90 transition-opacity" aria-hidden="true" on:click={closeModal}></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block align-middle max-w-4xl w-full relative">
        <!-- Close button -->
        <button
          on:click={closeModal}
          class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <img
          src={selectedImage.src}
          alt={selectedImage.titulo}
          class="max-h-[80vh] mx-auto rounded-2xl"
        />
        <p class="text-white text-center mt-4 text-xl font-semibold">{selectedImage.titulo}</p>
      </div>
    </div>
  </div>
{/if}
