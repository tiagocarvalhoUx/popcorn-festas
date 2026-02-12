<script>
  import { link } from "svelte-routing";
  import { onMount } from "svelte";

  let visibleSections = new Set();

  const servicos = [
    { name: "Pipoca Gourmet", image: "/Galeria-Popcorn/carrinho-pipoca-pelucia.png", color: "bg-popcorn-yellow" },
    { name: "Algodão Doce", image: "/Galeria-Popcorn/ilha-algodao-doce.png", color: "bg-popcorn-pink" },
    { name: "Sorvete", image: "/Galeria-Popcorn/maquina-sorvete.png", color: "bg-popcorn-blue" },
    { name: "Hot Dog", image: "/Galeria-Popcorn/carrinho-hotdog.png", color: "bg-popcorn-orange" },
    { name: "Máquina de Pelúcia", image: "/fotos/Galeria/maquina-de-bichinho-led.png", color: "bg-popcorn-purple" },
    { name: "Infláveis", image: "/Galeria-Popcorn/escorregador-inflavel.png", color: "bg-popcorn-green" },
  ];

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target.id);
            visibleSections = visibleSections;
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.observe-section').forEach(section => {
      observer.observe(section);
    });
  });
</script>

<!-- Hero Section -->
<section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
  <!-- Background Image -->
  <div class="absolute inset-0 z-0">
    <img 
      src="/fotos/Bg-home.svg" 
      alt="Background" 
      class="w-full h-full object-cover"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-popcorn-light"></div>
  </div>

  <!-- Content -->
  <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
    <div class="animate-float">
      <img 
        src="/fotos/popcorn-festas-logo.png" 
        alt="PopCorn Festas" 
        class="h-32 md:h-48 mx-auto mb-6 drop-shadow-2xl"
      />
    </div>
    <h1 class="text-4xl md:text-6xl font-display text-white mb-4 drop-shadow-lg">
      Transforme sua Festa em
      <span class="text-popcorn-yellow">Uma Experiência Inesquecível!</span>
    </h1>
    <p class="text-lg md:text-xl text-white mb-8 drop-shadow-md max-w-2xl mx-auto">
      Pipoca gourmet, algodão doce, sorvete, hot dog e muito mais! 
      Tudo para tornar seu evento único e divertido.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a 
        href="/construir-festa" 
        use:link 
        class="bg-popcorn-yellow text-popcorn-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl"
      >
        🎉 Monte sua Festa
      </a>
      <a 
        href="/catalogo" 
        use:link 
        class="bg-white text-popcorn-red px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
      >
        📋 Ver Catálogo
      </a>
    </div>
  </div>

  <!-- Floating Elements -->
  <div class="absolute top-20 left-10 animate-float" style="animation-delay: 0.5s;">
    <span class="text-4xl">🍿</span>
  </div>
  <div class="absolute top-40 right-20 animate-float" style="animation-delay: 1s;">
    <span class="text-4xl">🎪</span>
  </div>
  <div class="absolute bottom-40 left-20 animate-float" style="animation-delay: 1.5s;">
    <span class="text-4xl">🎈</span>
  </div>
  <div class="absolute bottom-20 right-10 animate-float" style="animation-delay: 0.8s;">
    <span class="text-4xl">🎊</span>
  </div>
</section>

<!-- Serviços Section -->
<section id="servicos" class="observe-section py-20 px-4">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-display text-popcorn-red mb-4">
        Nossos Serviços
      </h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Escolha entre nossa variedade de serviços para criar a festa perfeita!
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each servicos as servico, i}
        <a 
          href="/catalogo" 
          use:link 
          class="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          class:opacity-0={!visibleSections.has('servicos')}
          class:animate-fade-in={visibleSections.has('servicos')}
          style="transition-delay: {i * 100}ms"
        >
          <div class="relative h-48 overflow-hidden {servico.color}">
            <img 
              src={servico.image} 
              alt={servico.name}
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div class="p-6">
            <h3 class="text-xl font-display text-gray-800 mb-2">{servico.name}</h3>
            <p class="text-gray-600">Clique para saber mais</p>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- Construtor Preview -->
<section id="construtor" class="observe-section py-20 px-4 bg-gradient-festive">
  <div class="max-w-6xl mx-auto">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div class="text-white">
        <h2 class="text-4xl md:text-5xl font-display mb-6">
          Monte sua Festa dos Sonhos! 🎨
        </h2>
        <p class="text-xl mb-8 opacity-90">
          Use nosso construtor interativo para montar o pacote perfeito para seu evento. 
          Escolha serviços, temas e receba sugestões personalizadas!
        </p>
        <ul class="space-y-4 mb-8">
          <li class="flex items-center space-x-3">
            <span class="text-2xl">🎯</span>
            <span>Sugestões inteligentes baseadas no seu evento</span>
          </li>
          <li class="flex items-center space-x-3">
            <span class="text-2xl">🎁</span>
            <span>Desbloqueie bônus e descontos especiais</span>
          </li>
          <li class="flex items-center space-x-3">
            <span class="text-2xl">💰</span>
            <span>Orçamento em tempo real</span>
          </li>
        </ul>
        <a 
          href="/construir-festa" 
          use:link 
          class="inline-block bg-white text-popcorn-red px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
        >
          Começar a Montar 🚀
        </a>
      </div>
      <div class="relative">
        <img 
          src="/fotos/foto-circus.png" 
          alt="Tema Circus" 
          class="rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
        />
        <div class="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">
          <div class="flex items-center space-x-2">
            <span class="text-3xl">🎪</span>
            <div>
              <p class="font-bold text-popcorn-dark">Temas Incríveis!</p>
              <p class="text-sm text-gray-600">Circus, Mickey e mais</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Depoimentos/Galeria Preview -->
<section id="depoimentos" class="observe-section py-20 px-4">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-display text-popcorn-red mb-4">
        Momentos Especiais
      </h2>
      <p class="text-xl text-gray-600">
        Veja alguns dos eventos incríveis que tornamos especiais!
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      {#each ['/fotos/Galeria/foto 01 galeria.png', '/fotos/Galeria/foto 02 galeria.png', '/fotos/Galeria/foto 03 galeria.png', '/fotos/Galeria/foto 04 galeria.png'] as img, i}
        <div class="relative group overflow-hidden rounded-2xl aspect-square">
          <img 
            src={img} 
            alt="Galeria"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span class="text-white font-semibold">Ver na Galeria</span>
          </div>
        </div>
      {/each}
    </div>

    <div class="text-center mt-8">
      <a 
        href="/galeria" 
        use:link 
        class="inline-block bg-popcorn-red text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-xl"
      >
        Ver Galeria Completa 📸
      </a>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-20 px-4 bg-popcorn-dark">
  <div class="max-w-4xl mx-auto text-center">
    <h2 class="text-4xl md:text-5xl font-display text-white mb-6">
      Pronto para começar? 🎉
    </h2>
    <p class="text-xl text-gray-300 mb-8">
      Solicite um orçamento personalizado e vamos criar juntos a festa dos seus sonhos!
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a 
        href="/orcamento" 
        use:link 
        class="bg-popcorn-yellow text-popcorn-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-xl"
      >
        Solicitar Orçamento
      </a>
      <a 
        href="https://wa.me/5511999999999" 
        target="_blank"
        class="bg-green-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
      >
        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        Falar no WhatsApp
      </a>
    </div>
  </div>
</section>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out forwards;
  }
</style>
