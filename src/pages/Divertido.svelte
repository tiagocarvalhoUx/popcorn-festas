<script>
  import { fly, fade } from "svelte/transition";

  // Quiz State
  let currentQuiz = null;
  let quizStep = 0;
  let quizScore = 0;
  let showQuizResult = false;

  // Memory Game State
  let memoryCards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let gameWon = false;

  const quizPerguntas = [
    {
      pergunta: "Qual é o sabor de pipoca mais tradicional?",
      opcoes: ["Caramelo", "Manteiga", "Queijo", "Chocolate"],
      resposta: 1,
      icone: "🍿"
    },
    {
      pergunta: "O que é preciso para fazer algodão doce?",
      opcoes: ["Água e sal", "Açúcar e ar", "Farinha e leite", "Chocolate e creme"],
      resposta: 1,
      icone: "🍭"
    },
    {
      pergunta: "Qual personagem é mascote da PopCorn Festas?",
      opcoes: ["Mickey", "Patati", "Palhaço Alto", "Todos os anteriores"],
      resposta: 3,
      icone: "🎪"
    },
    {
      pergunta: "Qual destes NÃO é um serviço da PopCorn Festas?",
      opcoes: ["Pipoca Gourmet", "Máquina de Pelúcia", "Pintura Facial", "Bubble House"],
      resposta: 2,
      icone: "🎭"
    },
    {
      pergunta: "Qual é a cor principal da marca PopCorn Festas?",
      opcoes: ["Azul", "Verde", "Vermelho", "Roxo"],
      resposta: 2,
      icone: "🎨"
    }
  ];

  const emojis = ['🍿', '🎪', '🎈', '🎉', '🎭', '🎨', '🎁', '🎀'];

  function startQuiz() {
    currentQuiz = 'festas';
    quizStep = 0;
    quizScore = 0;
    showQuizResult = false;
  }

  function answerQuiz(optionIndex) {
    if (optionIndex === quizPerguntas[quizStep].resposta) {
      quizScore++;
    }
    
    if (quizStep < quizPerguntas.length - 1) {
      quizStep++;
    } else {
      showQuizResult = true;
    }
  }

  function resetQuiz() {
    currentQuiz = null;
    quizStep = 0;
    quizScore = 0;
    showQuizResult = false;
  }

  function initMemoryGame() {
    currentQuiz = 'memory';
    matchedPairs = 0;
    moves = 0;
    gameWon = false;
    flippedCards = [];
    
    // Create pairs
    const pairs = [...emojis, ...emojis];
    memoryCards = pairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false
      }));
  }

  function flipCard(card) {
    if (flippedCards.length >= 2 || card.flipped || card.matched) return;
    
    card.flipped = true;
    flippedCards = [...flippedCards, card];
    
    if (flippedCards.length === 2) {
      moves++;
      if (flippedCards[0].emoji === flippedCards[1].emoji) {
        // Match!
        setTimeout(() => {
          flippedCards[0].matched = true;
          flippedCards[1].matched = true;
          matchedPairs++;
          flippedCards = [];
          
          if (matchedPairs === emojis.length) {
            gameWon = true;
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          flippedCards[0].flipped = false;
          flippedCards[1].flipped = false;
          flippedCards = [];
        }, 1000);
      }
    }
  }

  function closeGame() {
    currentQuiz = null;
  }

  function getResultMessage() {
    const percentage = (quizScore / quizPerguntas.length) * 100;
    if (percentage === 100) return { text: "Perfeito! Você é um mestre das festas! 🎉", emoji: "🏆" };
    if (percentage >= 80) return { text: "Muito bem! Você conhece bastante! 🌟", emoji: "⭐" };
    if (percentage >= 60) return { text: "Bom trabalho! Continue aprendendo! 👍", emoji: "👍" };
    return { text: "Continue tentando! A prática leva à perfeição! 💪", emoji: "🎯" };
  }
</script>

<div class="min-h-screen py-8 px-4">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-display text-popcorn-red mb-4">
        Área Divertida 🎮
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Jogos, quizzes e diversão para você se divertir enquanto planeja sua festa!
      </p>
    </div>

    <!-- Games Grid -->
    {#if !currentQuiz}
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Quiz Card -->
        <button
          on:click={startQuiz}
          class="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
        >
          <div class="text-6xl mb-4 group-hover:scale-110 transition-transform">❓</div>
          <h3 class="text-2xl font-display text-gray-800 mb-2">Quiz das Festas</h3>
          <p class="text-gray-600">
            Teste seus conhecimentos sobre festas e ganhe prêmios virtuais!
          </p>
          <span class="inline-block mt-4 bg-popcorn-red text-white px-6 py-2 rounded-full font-semibold">
            Jogar
          </span>
        </button>

        <!-- Memory Game Card -->
        <button
          on:click={initMemoryGame}
          class="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
        >
          <div class="text-6xl mb-4 group-hover:scale-110 transition-transform">🧠</div>
          <h3 class="text-2xl font-display text-gray-800 mb-2">Jogo da Memória</h3>
          <p class="text-gray-600">
            Encontre os pares iguais no menor número de movimentos!
          </p>
          <span class="inline-block mt-4 bg-popcorn-yellow text-popcorn-dark px-6 py-2 rounded-full font-semibold">
            Jogar
          </span>
        </button>

        <!-- Coming Soon Card -->
        <div class="bg-gradient-to-br from-popcorn-purple to-popcorn-pink rounded-3xl shadow-lg p-8 text-center text-white opacity-75">
          <div class="text-6xl mb-4">🚧</div>
          <h3 class="text-2xl font-display mb-2">Em Breve</h3>
          <p class="opacity-90">
            Novos jogos e atividades divertidas estão chegando!
          </p>
          <span class="inline-block mt-4 bg-white/20 px-6 py-2 rounded-full font-semibold">
            Aguarde
          </span>
        </div>
      </div>

      <!-- Fun Facts -->
      <div class="mt-16">
        <h2 class="text-3xl font-display text-gray-800 mb-8 text-center">Curiosidades Divertidas 🎪</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <span class="text-4xl">🍿</span>
            <h4 class="font-semibold text-gray-800 mt-3">Pipoca</h4>
            <p class="text-sm text-gray-600 mt-1">A pipoca é o snack mais popular do cinema há mais de 100 anos!</p>
          </div>
          <div class="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <span class="text-4xl">🍭</span>
            <h4 class="font-semibold text-gray-800 mt-3">Algodão Doce</h4>
            <p class="text-sm text-gray-600 mt-1">Foi inventado por um dentista em 1897!</p>
          </div>
          <div class="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <span class="text-4xl">🎈</span>
            <h4 class="font-semibold text-gray-800 mt-3">Balões</h4>
            <p class="text-sm text-gray-600 mt-1">O balão de látex foi inventado em 1824!</p>
          </div>
          <div class="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <span class="text-4xl">🎪</span>
            <h4 class="font-semibold text-gray-800 mt-3">Circo</h4>
            <p class="text-sm text-gray-600 mt-1">O primeiro circo moderno foi criado em 1768 na Inglaterra!</p>
          </div>
        </div>
      </div>

      <!-- Daily Challenge -->
      <div class="mt-16 bg-gradient-festive rounded-3xl p-8 text-white text-center">
        <span class="text-5xl">🏆</span>
        <h2 class="text-3xl font-display mt-4 mb-2">Desafio do Dia</h2>
        <p class="text-xl opacity-90 mb-6">
          Complete o Quiz das Festas com 100% de acerto e ganhe um cupom especial!
        </p>
        <button
          on:click={startQuiz}
          class="bg-white text-popcorn-red px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
        >
          Aceitar Desafio
        </button>
      </div>
    {/if}

    <!-- Quiz Game -->
    {#if currentQuiz === 'festas'}
      <div class="max-w-2xl mx-auto" transition:fly={{ y: 20 }}>
        <div class="bg-white rounded-3xl shadow-lg p-8">
          <!-- Quiz Header -->
          <div class="flex items-center justify-between mb-8">
            <button
              on:click={closeGame}
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Voltar
            </button>
            <div class="text-center">
              <span class="text-sm text-gray-500">Pergunta</span>
              <p class="text-2xl font-bold text-popcorn-red">{quizStep + 1}/{quizPerguntas.length}</p>
            </div>
            <div class="text-center">
              <span class="text-sm text-gray-500">Pontos</span>
              <p class="text-2xl font-bold text-popcorn-yellow">{quizScore}</p>
            </div>
          </div>

          {#if !showQuizResult}
            <!-- Question -->
            <div class="text-center mb-8">
              <span class="text-6xl">{quizPerguntas[quizStep].icone}</span>
              <h3 class="text-xl font-semibold text-gray-800 mt-4">
                {quizPerguntas[quizStep].pergunta}
              </h3>
            </div>

            <!-- Options -->
            <div class="space-y-3">
              {#each quizPerguntas[quizStep].opcoes as opcao, i}
                <button
                  on:click={() => answerQuiz(i)}
                  class="w-full p-4 rounded-xl border-2 border-gray-200 text-left hover:border-popcorn-red hover:bg-red-50 transition-all"
                >
                  <span class="font-semibold text-popcorn-red mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opcao}
                </button>
              {/each}
            </div>
          {:else}
            <!-- Results -->
            <div class="text-center" transition:fade>
              <span class="text-6xl">{getResultMessage().emoji}</span>
              <h3 class="text-2xl font-display text-gray-800 mt-4">
                {getResultMessage().text}
              </h3>
              <p class="text-4xl font-bold text-popcorn-red mt-4">
                {quizScore}/{quizPerguntas.length}
              </p>
              <p class="text-gray-600 mt-2">
                Você acertou {Math.round((quizScore / quizPerguntas.length) * 100)}% das perguntas!
              </p>
              
              {#if quizScore === quizPerguntas.length}
                <div class="mt-6 p-4 bg-green-100 rounded-xl">
                  <p class="text-green-800 font-semibold">🎉 Parabéns! Você desbloqueou um cupom especial!</p>
                  <p class="text-green-600 text-sm mt-1">Use POPCORN10 para 10% de desconto!</p>
                </div>
              {/if}

              <button
                on:click={resetQuiz}
                class="mt-6 bg-popcorn-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
              >
                Jogar Novamente
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Memory Game -->
    {#if currentQuiz === 'memory'}
      <div class="max-w-2xl mx-auto" transition:fly={{ y: 20 }}>
        <div class="bg-white rounded-3xl shadow-lg p-8">
          <!-- Game Header -->
          <div class="flex items-center justify-between mb-8">
            <button
              on:click={closeGame}
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Voltar
            </button>
            <div class="flex gap-6">
              <div class="text-center">
                <span class="text-sm text-gray-500">Movimentos</span>
                <p class="text-xl font-bold text-popcorn-red">{moves}</p>
              </div>
              <div class="text-center">
                <span class="text-sm text-gray-500">Pares</span>
                <p class="text-xl font-bold text-popcorn-yellow">{matchedPairs}/{emojis.length}</p>
              </div>
            </div>
          </div>

          {#if gameWon}
            <div class="text-center mb-8" transition:fade>
              <span class="text-6xl">🎉</span>
              <h3 class="text-2xl font-display text-gray-800 mt-4">Parabéns!</h3>
              <p class="text-gray-600">Você completou em {moves} movimentos!</p>
              <button
                on:click={initMemoryGame}
                class="mt-4 bg-popcorn-red text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition-colors"
              >
                Jogar Novamente
              </button>
            </div>
          {/if}

          <!-- Game Grid -->
          <div class="grid grid-cols-4 gap-3">
            {#each memoryCards as card}
              <button
                on:click={() => flipCard(card)}
                class="aspect-square rounded-xl text-4xl flex items-center justify-center transition-all transform {card.flipped || card.matched ? 'bg-popcorn-yellow rotate-0' : 'bg-popcorn-red rotate-0 hover:scale-105'}"
                disabled={card.matched}
              >
                {#if card.flipped || card.matched}
                  {card.emoji}
                {:else}
                  <span class="text-white text-2xl">?</span>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
