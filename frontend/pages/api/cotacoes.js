// API para cotações agrícolas baseadas na região
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { regiao } = req.query;

  if (!regiao) {
    return res.status(400).json({ error: 'Parâmetro "regiao" é obrigatório' });
  }

  try {
    // Dados mockados de cotações por região
    const cotacoesPorRegiao = {
      'São Paulo, SP': [
        { produto: 'Soja', preco: 'R$ 155,00/sc', variacao: '+2,5%', unidade: 'sc' },
        { produto: 'Milho', preco: 'R$ 88,00/sc', variacao: '+1,8%', unidade: 'sc' },
        { produto: 'Trigo', preco: 'R$ 72,00/sc', variacao: '-0,5%', unidade: 'sc' },
        { produto: 'Arroz', preco: 'R$ 95,00/sc', variacao: '+1,2%', unidade: 'sc' },
        { produto: 'Feijão', preco: 'R$ 280,00/sc', variacao: '+3,1%', unidade: 'sc' }
      ],
      'Mato Grosso, MT': [
        { produto: 'Soja', preco: 'R$ 148,00/sc', variacao: '+2,1%', unidade: 'sc' },
        { produto: 'Milho', preco: 'R$ 82,00/sc', variacao: '+1,5%', unidade: 'sc' },
        { produto: 'Algodão', preco: 'R$ 420,00/sc', variacao: '+4,2%', unidade: 'sc' },
        { produto: 'Arroz', preco: 'R$ 92,00/sc', variacao: '+0,8%', unidade: 'sc' }
      ],
      'Rio Grande do Sul, RS': [
        { produto: 'Soja', preco: 'R$ 158,00/sc', variacao: '+2,8%', unidade: 'sc' },
        { produto: 'Milho', preco: 'R$ 90,00/sc', variacao: '+2,0%', unidade: 'sc' },
        { produto: 'Trigo', preco: 'R$ 75,00/sc', variacao: '+1,5%', unidade: 'sc' },
        { produto: 'Arroz', preco: 'R$ 98,00/sc', variacao: '+1,8%', unidade: 'sc' }
      ],
      'Paraná, PR': [
        { produto: 'Soja', preco: 'R$ 152,00/sc', variacao: '+2,3%', unidade: 'sc' },
        { produto: 'Milho', preco: 'R$ 86,00/sc', variacao: '+1,7%', unidade: 'sc' },
        { produto: 'Trigo', preco: 'R$ 73,00/sc', variacao: '+0,9%', unidade: 'sc' },
        { produto: 'Feijão', preco: 'R$ 275,00/sc', variacao: '+2,8%', unidade: 'sc' }
      ],
      'Goiás, GO': [
        { produto: 'Soja', preco: 'R$ 150,00/sc', variacao: '+2,0%', unidade: 'sc' },
        { produto: 'Milho', preco: 'R$ 84,00/sc', variacao: '+1,6%', unidade: 'sc' },
        { produto: 'Arroz', preco: 'R$ 94,00/sc', variacao: '+1,1%', unidade: 'sc' },
        { produto: 'Feijão', preco: 'R$ 270,00/sc', variacao: '+2,5%', unidade: 'sc' }
      ]
    };

    // Buscar cotações para a região específica
    let cotacoes = cotacoesPorRegiao[regiao];

    // Se não encontrar a região específica, usar dados genéricos do Brasil
    if (!cotacoes) {
      cotacoes = [
        { produto: 'Soja', preco: 'R$ 153,00/sc', variacao: '+2,3%', unidade: 'sc' },
        { produto: 'Milho', preco: 'R$ 87,00/sc', variacao: '+1,7%', unidade: 'sc' },
        { produto: 'Trigo', preco: 'R$ 73,00/sc', variacao: '+0,8%', unidade: 'sc' },
        { produto: 'Arroz', preco: 'R$ 96,00/sc', variacao: '+1,5%', unidade: 'sc' },
        { produto: 'Feijão', preco: 'R$ 275,00/sc', variacao: '+2,8%', unidade: 'sc' }
      ];
    }

    // Adicionar metadados
    const response = {
      regiao: regiao,
      dataAtualizacao: new Date().toISOString(),
      fonte: 'Agroisync - Dados Simulados',
      cotacoes: cotacoes,
      totalProdutos: cotacoes.length
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao obter cotações:', error);

    // Dados de fallback em caso de erro
    const fallbackData = {
      regiao: regiao,
      dataAtualizacao: new Date().toISOString(),
      fonte: 'Agroisync - Dados de Fallback',
      cotacoes: [
        { produto: 'Soja', preco: 'R$ 150,00/sc', variacao: 'N/A', unidade: 'sc' },
        { produto: 'Milho', preco: 'R$ 85,00/sc', variação: 'N/A', unidade: 'sc' },
        { produto: 'Trigo', preco: 'R$ 70,00/sc', variacao: 'N/A', unidade: 'sc' }
      ],
      totalProdutos: 3
    };

    res.status(200).json(fallbackData);
  }
}
