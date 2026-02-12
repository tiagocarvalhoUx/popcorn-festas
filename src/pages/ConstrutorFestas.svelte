<script>
  import { link } from "svelte-routing";
  import { fly, fade, scale } from "svelte/transition";
  import { servicos, temas } from "../data/servicos.js";
  import { getSugestoes } from "../stores/construtor.js";
  import { 
    eventoBuilder, 
    totalOrçamento, 
    conquistas, 
    descontosDisponiveis,
    adicionarServico,
    removerServico,
    toggleServico,
    setTipoEvento,
    setNumConvidados,
    setTema,
    limparBuilder
  } from "../stores/construtor.js";

  let step = 1;
  let showCelebration = false;
  let unlockedAchievement = null;

  const tiposEvento = [
    { id: 'infantil', nome: 'Festa Infantil', icon: '🎈', desc: 'Para crianças até 12 anos' },
    { id: 'teen', nome: 'Festa Teen', icon: '🎮', desc: 'Para adolescentes' },
    { id: 'adulto', nome: 'Festa Adulto', icon: '🎉', desc: 'Para adultos' },
    { id: 'corporativo', nome: 'Evento Corporativo', icon: '💼', desc: 'Eventos empresariais' }
  ];

  $: sugestoes = getSugestoes($eventoBuilder.tipoEvento, $eventoBuilder.numConvidados);
  $: servicosGastronomia = servicos.filter(s => s.categoria === 'gastronomia');
  $: servicosDiversao = servicos.filter(s => s.categoria === 'diversao');

  function nextStep() {
    if (step < 4) {
      step++;
    }
  }

  function prevStep() {
    if (step > 1) {
      step--;
    }
  }

  function aplicarSugestao() {
    if (sugestoes) {
      sugestoes.servicos.forEach(id => adicionarServico(id));
    }
  }

  function onToggleServico(id) {
    const wasSelected = $eventoBuilder.servicosSelecionados.includes(id);
    toggleServico(id);
    
    // Check for new achievements
    const prevConquistas = $conquistas.filter(c => c.unlocked).length;
    setTimeout(() => {
      const newConquistas = $conquistas.filter(c => c.unlocked);
      if (newConquistas.length > prevConquistas) {
        const latest = newConquistas[newConquistas.length - 1];
        if (!wasSelected) {
          unlockedAchievement = latest;
          showCelebration = true;
          setTimeout(() => {
            showCelebration = false;
            unlockedAchievement = null;
          }, 3000);
        }
      }
    }, 100);
  }

  function getProgressPercent() {
    return (step / 4) * 100;
  }
</script>

<div class="min-h-screen py-8 px-4">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl md:text-5xl font-display text-popcorn-red mb-4">
        🎨 Monte sua Festa
      </h1>
      <p class="text-xl text-gray-600">
        Use nosso construtor gamificado para criar a festa perfeita!
      </p>
    </div>

    <!-- Progress Bar -->
    <div class="bg-white rounded-full h-4 mb-8 shadow-inner overflow-hidden">
      <div 
        class="h-full bg-gradient-festive transition-all duration-500"
        style="width: {getProgressPercent()}%"
      ></div>
    </div>

    <!-- Steps Indicator -->
    <div class="flex justify-between mb-8 max-w-2xl mx-auto">
      {#each ['Tipo', 'Tema', 'Serviços', 'Resumo'] as label, i}
        <div class="flex flex-col items-center">
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors {step > i ? 'bg-popcorn-red text-white' : step === i + 1 ? 'bg-popcorn-yellow text-popcorn-dark' : 'bg-gray-200 text-gray-500'}"
          >
            {i + 1}
          </div>
          <span class="text-sm mt-2 {step === i + 1 ? 'text-popcorn-red font-semibold' : 'text-gray-500'}">{label}</span>
        </div>
      {/each}
    </div>

    <!-- Celebration Overlay -->
    {#if showCelebration && unlockedAchievement}
      <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none" transition:fade>
        <div class="bg-white rounded-3xl p-8 text-center shadow-2xl transform scale-110" transition:scale>
          <div class="text-6xl mb-4">{unlockedAchievement.icon}</div>
          <h3 class="text-2xl font-display text-popcorn-red mb-2">Conquista Desbloqueada!</h3>
          <p class="text-xl font-semibold text-gray-800">{unlockedAchievement.nome}</p>
          <p class="text-gray-600">{unlockedAchievement.descricao}</p>
        </div>
      </div>
    {/if}

    <!-- Step 1: Tipo de Evento -->
    {#if step === 1}
      <div class="bg-white rounded-3xl shadow-lg p-8" transition:fly={{ y: 20 }}>
        <h2 class="text-2xl font-display text-gray-800 mb-6 text-center">
          Qual tipo de evento você está planejando?
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each tiposEvento as tipo}
            <button
              class="p-6 rounded-2xl border-2 text-left transition-all transform hover:scale-105 {eventoBuilder.tipoEvento === tipo.id ? 'border-popcorn-red bg-red-50' : 'border-gray-200 hover:border-popcorn-yellow'}"
              on:click={() => setTipoEvento(tipo.id)}
            >
              <div class="flex items-start space-x-4">
                <span class="text-4xl">{tipo.icon}</span>
                <div>
                  <h3 class="text-xl font-display text-gray-800">{tipo.nome}</h3>
                  <p class="text-gray-600">{tipo.desc}</p>
                </div>
              </div>
            </button>
          {/each}
        </div>

        <!-- Número de Convidados -->
        <div class="mt-8 p-6 bg-gray-50 rounded-2xl">
          <label for="numConvidados" class="block text-lg font-semibold text-gray-800 mb-4">
            Quantidade de convidados: <span class="text-popcorn-red">{$eventoBuilder.numConvidados}</span>
          </label>
          <input
            id="numConvidados"
            type="range"
            min="10"
            max="300"
            step="10"
            bind:value={$eventoBuilder.numConvidados}
            on:change={(e) => setNumConvidados(parseInt(e.target.value))}
            class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-popcorn-red"
          />
          <div class="flex justify-between text-sm text-gray-500 mt-2">
            <span>10</span>
            <span>150</span>
            <span>300</span>
          </div>
        </div>

        <!-- Sugestões -->
        {#if sugestoes}
          <div class="mt-8 p-6 bg-popcorn-yellow/20 rounded-2xl border-2 border-popcorn-yellow">
            <div class="flex items-start space-x-4">
              <span class="text-3xl">💡</span>
              <div>
                <h4 class="font-semibold text-gray-800">Sugestão para {tiposEvento.find(t => t.id === $eventoBuilder.tipoEvento)?.nome}</h4>
                <p class="text-gray-600 mb-3">{sugestoes.descricao}</p>
                <button
                  on:click={aplicarSugestao}
                  class="bg-popcorn-red text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Aplicar Sugestão
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Step 2: Tema -->
    {#if step === 2}
      <div class="bg-white rounded-3xl shadow-lg p-8" transition:fly={{ y: 20 }}>
        <h2 class="text-2xl font-display text-gray-800 mb-6 text-center">
          Escolha um tema para sua festa
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {#each temas as tema}
            <button
              class="relative rounded-2xl overflow-hidden transition-all transform hover:scale-105 {eventoBuilder.tema === tema.id ? 'ring-4 ring-popcorn-red' : ''}"
              on:click={() => setTema(tema.id)}
            >
              <img src={tema.imagem} alt={tema.nome} class="w-full h-48 object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <div class="text-white">
                  <h3 class="text-xl font-display">{tema.nome}</h3>
                  <p class="text-sm opacity-90">{tema.descricao.slice(0, 60)}...</p>
                </div>
              </div>
              {#if eventoBuilder.tema === tema.id}
                <div class="absolute top-4 right-4 bg-popcorn-red text-white w-8 h-8 rounded-full flex items-center justify-center">
                  ✓
                </div>
              {/if}
            </button>
          {/each}
        </div>

        <div class="mt-6 text-center">
          <button
            on:click={() => setTema('')}
            class="text-gray-500 hover:text-popcorn-red transition-colors"
          >
            Prefiro sem tema específico
          </button>
        </div>
      </div>
    {/if}

    <!-- Step 3: Serviços -->
    {#if step === 3}
      <div class="grid lg:grid-cols-3 gap-8" transition:fly={{ y: 20 }}>
        <!-- Serviços Selection -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Gastronomia -->
          <div class="bg-white rounded-3xl shadow-lg p-6">
            <h3 class="text-xl font-display text-gray-800 mb-4 flex items-center">
              <span class="text-2xl mr-2">🍽️</span> Gastronomia
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {#each servicosGastronomia as servico}
                <button
                  class="p-4 rounded-xl border-2 text-left transition-all hover:shadow-md {$eventoBuilder.servicosSelecionados.includes(servico.id) ? 'border-popcorn-red bg-red-50' : 'border-gray-200'}"
                  on:click={() => onToggleServico(servico.id)}
                >
                  <div class="flex items-center space-x-3">
                    <img src={servico.imagem} alt={servico.nome} class="w-16 h-16 object-cover rounded-lg" />
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-800">{servico.nome}</h4>
                      <p class="text-popcorn-red font-bold">R$ {servico.preco.toLocaleString('pt-BR')}</p>
                    </div>
                    {#if $eventoBuilder.servicosSelecionados.includes(servico.id)}
                      <span class="text-popcorn-red text-xl">✓</span>
                    {/if}
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <!-- Diversão -->
          <div class="bg-white rounded-3xl shadow-lg p-6">
            <h3 class="text-xl font-display text-gray-800 mb-4 flex items-center">
              <span class="text-2xl mr-2">🎮</span> Diversão
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {#each servicosDiversao as servico}
                <button
                  class="p-4 rounded-xl border-2 text-left transition-all hover:shadow-md {$eventoBuilder.servicosSelecionados.includes(servico.id) ? 'border-popcorn-red bg-red-50' : 'border-gray-200'}"
                  on:click={() => onToggleServico(servico.id)}
                >
                  <div class="flex items-center space-x-3">
                    <img src={servico.imagem} alt={servico.nome} class="w-16 h-16 object-cover rounded-lg" />
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-800">{servico.nome}</h4>
                      <p class="text-popcorn-red font-bold">R$ {servico.preco.toLocaleString('pt-BR')}</p>
                    </div>
                    {#if $eventoBuilder.servicosSelecionados.includes(servico.id)}
                      <span class="text-popcorn-red text-xl">✓</span>
                    {/if}
                  </div>
                </button>
              {/each}
            </div>
          </div>
        </div>

        <!-- Sidebar: Budget & Achievements -->
        <div class="space-y-6">
          <!-- Budget Card -->
          <div class="bg-popcorn-dark rounded-3xl p-6 text-white sticky top-24">
            <h3 class="text-xl font-display mb-4">💰 Orçamento</h3>
            
            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span class="text-gray-300">Subtotal</span>
                <span>R$ {$totalOrçamento.subtotal.toLocaleString('pt-BR')}</span>
              </div>
              {#if $totalOrçamento.desconto > 0}
                <div class="flex justify-between text-green-400">
                  <span>Desconto ({$totalOrçamento.percentualDesconto}%)</span>
                  <span>- R$ {$totalOrçamento.desconto.toLocaleString('pt-BR')}</span>
                </div>
              {/if}
              <div class="border-t border-gray-600 pt-2 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span class="text-popcorn-yellow">R$ {$totalOrçamento.total.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <!-- Discounts -->
            {#if $descontosDisponiveis.some(d => d.ativo)}
              <div class="mb-4">
                <p class="text-sm text-gray-400 mb-2">Descontos ativos:</p>
                {#each $descontosDisponiveis.filter(d => d.ativo) as desconto}
                  <span class="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full mr-1">
                    {desconto.nome}
                  </span>
                {/each}
              </div>
            {/if}

            <a
              href="/orcamento"
              use:link
              class="block w-full bg-popcorn-yellow text-popcorn-dark text-center py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors"
            >
              Finalizar Orçamento
            </a>
          </div>

          <!-- Achievements -->
          <div class="bg-white rounded-3xl shadow-lg p-6">
            <h3 class="text-lg font-display text-gray-800 mb-4">🏆 Conquistas</h3>
            <div class="space-y-3">
              {#each $conquistas as conquista}
                <div class="flex items-center space-x-3 p-3 rounded-xl {conquista.unlocked ? 'bg-green-50' : 'bg-gray-50 opacity-50'}">
                  <span class="text-2xl">{conquista.icon}</span>
                  <div class="flex-1">
                    <p class="font-semibold text-sm {conquista.unlocked ? 'text-gray-800' : 'text-gray-500'}">{conquista.nome}</p>
                    <p class="text-xs text-gray-500">{conquista.descricao}</p>
                  </div>
                  {#if conquista.unlocked}
                    <span class="text-green-500">✓</span>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Step 4: Summary -->
    {#if step === 4}
      <div class="bg-white rounded-3xl shadow-lg p-8" transition:fly={{ y: 20 }}>
        <h2 class="text-2xl font-display text-gray-800 mb-6 text-center">
          Resumo da sua Festa 🎉
        </h2>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Event Details -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Detalhes do Evento</h3>
            <div class="space-y-3 bg-gray-50 p-6 rounded-2xl">
              <div class="flex justify-between">
                <span class="text-gray-600">Tipo:</span>
                <span class="font-semibold">{tiposEvento.find(t => t.id === $eventoBuilder.tipoEvento)?.nome || 'Não definido'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Convidados:</span>
                <span class="font-semibold">{$eventoBuilder.numConvidados}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tema:</span>
                <span class="font-semibold">{temas.find(t => t.id === $eventoBuilder.tema)?.nome || 'Sem tema'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Serviços:</span>
                <span class="font-semibold">{$eventoBuilder.servicosSelecionados.length}</span>
              </div>
            </div>
          </div>

          <!-- Selected Services -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Serviços Selecionados</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              {#each $eventoBuilder.servicosSelecionados as servicoId}
                {@const servico = servicos.find(s => s.id === servicoId)}
                {#if servico}
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div class="flex items-center space-x-3">
                      <img src={servico.imagem} alt={servico.nome} class="w-10 h-10 object-cover rounded-lg" />
                      <span class="font-medium">{servico.nome}</span>
                    </div>
                    <span class="text-popcorn-red font-semibold">R$ {servico.preco.toLocaleString('pt-BR')}</span>
                  </div>
                {/if}
              {/each}
            </div>
          </div>
        </div>

        <!-- Final Budget -->
        <div class="mt-8 bg-popcorn-dark rounded-2xl p-6 text-white text-center">
          <p class="text-gray-300 mb-2">Valor Total Estimado</p>
          {#if $totalOrçamento.desconto > 0}
            <p class="text-lg line-through text-gray-500">
              R$ {$totalOrçamento.subtotal.toLocaleString('pt-BR')}
            </p>
            <p class="text-4xl font-display text-popcorn-yellow">
              R$ {$totalOrçamento.total.toLocaleString('pt-BR')}
            </p>
            <p class="text-green-400 text-sm mt-1">
              Você economizou R$ {$totalOrçamento.desconto.toLocaleString('pt-BR')}!
            </p>
          {:else}
            <p class="text-4xl font-display text-popcorn-yellow">
              R$ {$totalOrçamento.total.toLocaleString('pt-BR')}
            </p>
          {/if}
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            on:click={() => limparBuilder()}
            class="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-full font-semibold hover:border-gray-400 transition-colors"
          >
            Começar Novo
          </button>
          <a
            href="/orcamento"
            use:link
            class="flex-1 bg-popcorn-red text-white text-center py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
          >
            Solicitar Orçamento Oficial →
          </a>
        </div>
      </div>
    {/if}

    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-8">
      <button
        on:click={prevStep}
        class="px-6 py-3 rounded-full font-semibold transition-colors {step === 1 ? 'invisible' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
      >
        ← Anterior
      </button>
      {#if step < 4}
        <button
          on:click={nextStep}
          class="px-6 py-3 bg-popcorn-red text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
        >
          Próximo →
        </button>
      {/if}
    </div>
  </div>
</div>
