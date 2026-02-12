import { writable, derived } from 'svelte/store';
import { servicos, temas } from '../data/servicos.js';

export const eventoBuilder = writable({
  tipoEvento: '',
  numConvidados: 50,
  tema: '',
  servicosSelecionados: [],
  data: '',
  observacoes: ''
});

export const conquistas = writable([
  { id: 'primeiro-servico', nome: 'Primeiros Passos', descricao: 'Adicione seu primeiro serviço', icon: '🎯', unlocked: false },
  { id: 'combo-gastronomia', nome: 'Festival Gastronômico', descricao: 'Selecione 3 serviços de gastronomia', icon: '🍽️', unlocked: false },
  { id: 'combo-diversao', nome: 'Parque de Diversões', descricao: 'Selecione 3 serviços de diversão', icon: '🎡', unlocked: false },
  { id: 'festa-completa', nome: 'Festa Completa', descricao: 'Selecione pelo menos 5 serviços', icon: '🎉', unlocked: false },
  { id: 'desconto-unlock', nome: 'Caçador de Ofertas', descricao: 'Desbloqueie um desconto especial', icon: '💰', unlocked: false }
]);

export const descontosDisponiveis = writable([
  { id: 'combo3', nome: 'Combo 3 serviços', descricao: '10% de desconto', percentual: 10, minServicos: 3, ativo: false },
  { id: 'combo5', nome: 'Combo 5+ serviços', descricao: '15% de desconto', percentual: 15, minServicos: 5, ativo: false },
  { id: 'gastronomia-diversao', nome: 'Combo Completo', descricao: '20% de desconto', percentual: 20, minGastronomia: 2, minDiversao: 2, ativo: false }
]);

export const totalOrçamento = derived(
  [eventoBuilder, descontosDisponiveis],
  ([$eventoBuilder, $descontos]) => {
    const subtotal = $eventoBuilder.servicosSelecionados.reduce((acc, id) => {
      const servico = servicos.find(s => s.id === id);
      return acc + (servico ? servico.preco : 0);
    }, 0);

    // Aplica o maior desconto ativo
    const descontoAtivo = $descontos
      .filter(d => d.ativo)
      .sort((a, b) => b.percentual - a.percentual)[0];

    const percentualDesconto = descontoAtivo ? descontoAtivo.percentual : 0;
    const valorDesconto = subtotal * (percentualDesconto / 100);
    const total = subtotal - valorDesconto;

    return {
      subtotal,
      desconto: valorDesconto,
      percentualDesconto,
      total,
      descontoAplicado: descontoAtivo
    };
  }
);

export function adicionarServico(servicoId) {
  eventoBuilder.update(builder => {
    if (!builder.servicosSelecionados.includes(servicoId)) {
      return {
        ...builder,
        servicosSelecionados: [...builder.servicosSelecionados, servicoId]
      };
    }
    return builder;
  });
  verificarConquistas();
  verificarDescontos();
}

export function removerServico(servicoId) {
  eventoBuilder.update(builder => ({
    ...builder,
    servicosSelecionados: builder.servicosSelecionados.filter(id => id !== servicoId)
  }));
  verificarDescontos();
}

export function toggleServico(servicoId) {
  eventoBuilder.update(builder => {
    if (builder.servicosSelecionados.includes(servicoId)) {
      return {
        ...builder,
        servicosSelecionados: builder.servicosSelecionados.filter(id => id !== servicoId)
      };
    }
    return {
      ...builder,
      servicosSelecionados: [...builder.servicosSelecionados, servicoId]
    };
  });
  verificarConquistas();
  verificarDescontos();
}

export function setTipoEvento(tipo) {
  eventoBuilder.update(builder => ({ ...builder, tipoEvento: tipo }));
}

export function setNumConvidados(num) {
  eventoBuilder.update(builder => ({ ...builder, numConvidados: num }));
}

export function setTema(tema) {
  eventoBuilder.update(builder => ({ ...builder, tema }));
}

export function limparBuilder() {
  eventoBuilder.set({
    tipoEvento: '',
    numConvidados: 50,
    tema: '',
    servicosSelecionados: [],
    data: '',
    observacoes: ''
  });
  descontosDisponiveis.update(descontos => 
    descontos.map(d => ({ ...d, ativo: false }))
  );
}

function verificarConquistas() {
  eventoBuilder.subscribe(builder => {
    conquistas.update(list => {
      return list.map(c => {
        if (c.unlocked) return c;
        
        let unlocked = false;
        const servicosSelecionados = builder.servicosSelecionados;
        
        switch (c.id) {
          case 'primeiro-servico':
            unlocked = servicosSelecionados.length >= 1;
            break;
          case 'combo-gastronomia':
            const gastronomiaCount = servicosSelecionados.filter(id => {
              const s = servicos.find(s => s.id === id);
              return s && s.categoria === 'gastronomia';
            }).length;
            unlocked = gastronomiaCount >= 3;
            break;
          case 'combo-diversao':
            const diversaoCount = servicosSelecionados.filter(id => {
              const s = servicos.find(s => s.id === id);
              return s && s.categoria === 'diversao';
            }).length;
            unlocked = diversaoCount >= 3;
            break;
          case 'festa-completa':
            unlocked = servicosSelecionados.length >= 5;
            break;
          case 'desconto-unlock':
            unlocked = servicosSelecionados.length >= 3;
            break;
        }
        
        return { ...c, unlocked };
      });
    });
  })();
}

function verificarDescontos() {
  eventoBuilder.subscribe(builder => {
    const selecionados = builder.servicosSelecionados;
    const gastronomiaCount = selecionados.filter(id => {
      const s = servicos.find(s => s.id === id);
      return s && s.categoria === 'gastronomia';
    }).length;
    const diversaoCount = selecionados.filter(id => {
      const s = servicos.find(s => s.id === id);
      return s && s.categoria === 'diversao';
    }).length;

    descontosDisponiveis.update(descontos => {
      return descontos.map(d => {
        let ativo = false;
        
        if (d.minServicos && selecionados.length >= d.minServicos) {
          ativo = true;
        }
        if (d.minGastronomia && d.minDiversao) {
          ativo = gastronomiaCount >= d.minGastronomia && diversaoCount >= d.minDiversao;
        }
        
        return { ...d, ativo };
      });
    });
  })();
}

// Sugestões inteligentes baseadas no tipo de evento
export function getSugestoes(tipoEvento, numConvidados) {
  const sugestoes = {
    infantil: {
      servicos: ['pipoca-gourmet', 'algodao-doce', 'inflaveis', 'maquina-pelucia'],
      descricao: 'Perfeito para crianças! Muita diversão e doces.'
    },
    teen: {
      servicos: ['pipoca-gourmet', 'hot-dog', 'touro-mecanico', 'mesa-hockey'],
      descricao: 'Para quem busca adrenalina e comida gostosa!'
    },
    adulto: {
      servicos: ['pipoca-gourmet', 'crepe', 'sorvete', 'bubble-house'],
      descricao: 'Sofisticação e diversão para adultos.'
    },
    corporativo: {
      servicos: ['pipoca-gourmet', 'hot-dog', 'algodao-doce', 'mesa-hockey'],
      descricao: 'Ideal para integração da equipe!'
    }
  };

  return sugestoes[tipoEvento] || null;
}
