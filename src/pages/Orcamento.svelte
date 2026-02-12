<script>
  import { onMount } from "svelte";
  import { servicos } from "../data/servicos.js";
  import { eventoBuilder, totalOrçamento } from "../stores/construtor.js";

  let formData = {
    nome: "",
    email: "",
    telefone: "",
    dataEvento: "",
    local: "",
    mensagem: ""
  };

  let isSubmitting = false;
  let submitted = false;
  let error = null;

  // Pre-fill with data from builder
  onMount(() => {
    const builderData = $eventoBuilder;
    if (builderData.servicosSelecionados.length > 0) {
      formData.mensagem = generateMessageFromBuilder(builderData);
    }
  });

  function generateMessageFromBuilder(builder) {
    const servicosNomes = builder.servicosSelecionados
      .map(id => servicos.find(s => s.id === id)?.nome)
      .filter(Boolean)
      .join(", ");
    
    return `Olá! Gostaria de solicitar um orçamento para uma festa ${builder.tipoEvento || ''} com ${builder.numConvidados} convidados.\n\nServiços de interesse: ${servicosNomes}\n\nData pretendida: ${builder.data || 'A definir'}`;
  }

  async function handleSubmit() {
    isSubmitting = true;
    error = null;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      submitted = true;
    } catch (e) {
      error = "Ocorreu um erro. Por favor, tente novamente.";
    } finally {
      isSubmitting = false;
    }
  }

  function getWhatsAppLink() {
    const message = encodeURIComponent(
      `*Orçamento PopCorn Festas*\n\n` +
      `*Nome:* ${formData.nome}\n` +
      `*Telefone:* ${formData.telefone}\n` +
      `*Email:* ${formData.email}\n` +
      `*Data do Evento:* ${formData.dataEvento || 'A definir'}\n` +
      `*Local:* ${formData.local || 'A definir'}\n\n` +
      `*Serviços Selecionados:*\n${$eventoBuilder.servicosSelecionados.map(id => {
        const s = servicos.find(s => s.id === id);
        return s ? `• ${s.nome} - R$ ${s.preco.toLocaleString('pt-BR')}` : '';
      }).filter(Boolean).join('\n')}\n\n` +
      `*Total Estimado:* R$ ${$totalOrçamento.total.toLocaleString('pt-BR')}\n\n` +
      `*Mensagem:*\n${formData.mensagem || 'Nenhuma mensagem adicional.'}`
    );
    return `https://wa.me/5511999999999?text=${message}`;
  }
</script>

<div class="min-h-screen py-8 px-4">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl md:text-5xl font-display text-popcorn-red mb-4">
        Solicitar Orçamento
      </h1>
      <p class="text-xl text-gray-600">
        Preencha o formulário abaixo e entraremos em contato em breve!
      </p>
    </div>

    {#if submitted}
      <!-- Success Message -->
      <div class="bg-white rounded-3xl shadow-lg p-8 text-center">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-3xl font-display text-gray-800 mb-4">Solicitação Enviada!</h2>
        <p class="text-gray-600 mb-8">
          Obrigado pelo interesse! Nossa equipe analisará seu pedido e entrará em contato em até 24 horas.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            class="bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            Enviar pelo WhatsApp
          </a>
          <a
            href="/"
            class="bg-popcorn-red text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transition-colors"
          >
            Voltar ao Início
          </a>
        </div>
      </div>
    {:else}
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Form -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-3xl shadow-lg p-8">
            {#if error}
              <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                <p class="text-red-700">{error}</p>
              </div>
            {/if}

            <form on:submit|preventDefault={handleSubmit} class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label for="nome" class="block text-sm font-semibold text-gray-700 mb-2">Nome completo *</label>
                  <input
                    id="nome"
                    type="text"
                    bind:value={formData.nome}
                    required
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-popcorn-red focus:outline-none transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    id="email"
                    type="email"
                    bind:value={formData.email}
                    required
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-popcorn-red focus:outline-none transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label for="telefone" class="block text-sm font-semibold text-gray-700 mb-2">Telefone *</label>
                  <input
                    id="telefone"
                    type="tel"
                    bind:value={formData.telefone}
                    required
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-popcorn-red focus:outline-none transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label for="dataEvento" class="block text-sm font-semibold text-gray-700 mb-2">Data do Evento</label>
                  <input
                    id="dataEvento"
                    type="date"
                    bind:value={formData.dataEvento}
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-popcorn-red focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label for="local" class="block text-sm font-semibold text-gray-700 mb-2">Local do Evento</label>
                <input
                  id="local"
                  type="text"
                  bind:value={formData.local}
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-popcorn-red focus:outline-none transition-colors"
                  placeholder="Endereço ou cidade"
                />
              </div>

              <div>
                <label for="mensagem" class="block text-sm font-semibold text-gray-700 mb-2">Mensagem / Detalhes adicionais</label>
                <textarea
                  id="mensagem"
                  bind:value={formData.mensagem}
                  rows="5"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-popcorn-red focus:outline-none transition-colors resize-none"
                  placeholder="Conte-nos mais sobre sua festa..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                class="w-full bg-popcorn-red text-white py-4 rounded-full font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {#if isSubmitting}
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                {:else}
                  Enviar Solicitação
                {/if}
              </button>
            </form>
          </div>
        </div>

        <!-- Sidebar: Summary -->
        <div>
          <div class="bg-popcorn-dark rounded-3xl p-6 text-white sticky top-24">
            <h3 class="text-xl font-display mb-6">Resumo do Orçamento</h3>

            {#if $eventoBuilder.servicosSelecionados.length > 0}
              <div class="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {#each $eventoBuilder.servicosSelecionados as servicoId}
                  {@const servico = servicos.find(s => s.id === servicoId)}
                  {#if servico}
                    <div class="flex items-center justify-between py-2 border-b border-gray-600">
                      <div class="flex items-center space-x-2">
                        <img src={servico.imagem} alt={servico.nome} class="w-10 h-10 object-cover rounded-lg" />
                        <span class="text-sm">{servico.nome}</span>
                      </div>
                      <span class="font-semibold">R$ {servico.preco.toLocaleString('pt-BR')}</span>
                    </div>
                  {/if}
                {/each}
              </div>

              <div class="border-t border-gray-600 pt-4">
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-400">Subtotal</span>
                  <span>R$ {$totalOrçamento.subtotal.toLocaleString('pt-BR')}</span>
                </div>
                {#if $totalOrçamento.desconto > 0}
                  <div class="flex justify-between text-sm mb-2 text-green-400">
                    <span>Desconto</span>
                    <span>- R$ {$totalOrçamento.desconto.toLocaleString('pt-BR')}</span>
                  </div>
                {/if}
                <div class="flex justify-between text-xl font-bold mt-2">
                  <span>Total</span>
                  <span class="text-popcorn-yellow">R$ {$totalOrçamento.total.toLocaleString('pt-BR')}</span>
                </div>
              </div>
            {:else}
              <p class="text-gray-400 text-center py-8">
                Nenhum serviço selecionado.<br>
                <a href="/construir-festa" class="text-popcorn-yellow hover:underline">Monte sua festa</a>
              </p>
            {/if}

            <!-- Quick WhatsApp -->
            <a
              href={getWhatsAppLink()}
              target="_blank"
              class="block w-full mt-6 bg-green-500 text-white text-center py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
            >
              Enviar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
