/**
 * CATEGORIAS COMPLETAS DO AGRONEGÓCIO
 * Inclui: Grãos, Gado, Madeira, Hortifruti, Insumos, Máquinas, etc
 */

export const CATEGORIAS_AGRO = {
  // 🌾 GRÃOS E CEREAIS
  graos: {
    id: 'graos',
    nome: 'Grãos e Cereais',
    icone: '🌾',
    subcategorias: [
      { id: 'soja', nome: 'Soja', icone: '🫘', unidade: 'saca' },
      { id: 'milho', nome: 'Milho', icone: '🌽', unidade: 'saca' },
      { id: 'trigo', nome: 'Trigo', icone: '🌾', unidade: 'saca' },
      { id: 'arroz', nome: 'Arroz', icone: '🍚', unidade: 'saca' },
      { id: 'feijao', nome: 'Feijão', icone: '🫘', unidade: 'saca' },
      { id: 'cafe', nome: 'Café', icone: '☕', unidade: 'saca' },
      { id: 'sorgo', nome: 'Sorgo', icone: '🌾', unidade: 'saca' },
      { id: 'aveia', nome: 'Aveia', icone: '🌾', unidade: 'saca' },
      { id: 'cevada', nome: 'Cevada', icone: '🌾', unidade: 'saca' }
    ],
    temCotacao: true
  },

  // 🐄 PECUÁRIA
  gado: {
    id: 'gado',
    nome: 'Gado e Pecuária',
    icone: '🐄',
    subcategorias: [
      { id: 'gado-corte', nome: 'Gado de Corte', icone: '🐂', unidade: 'cabeça' },
      { id: 'gado-leite', nome: 'Gado Leiteiro', icone: '🥛', unidade: 'cabeça' },
      { id: 'touros', nome: 'Touros Reprodutores', icone: '🐃', unidade: 'cabeça' },
      { id: 'bezerros', nome: 'Bezerros', icone: '🐮', unidade: 'cabeça' },
      { id: 'cavalos', nome: 'Cavalos', icone: '🐴', unidade: 'cabeça' },
      { id: 'suinos', nome: 'Suínos', icone: '🐷', unidade: 'cabeça' },
      { id: 'aves', nome: 'Aves (Frango/Galinha)', icone: '🐔', unidade: 'cabeça' },
      { id: 'ovinos', nome: 'Ovinos (Ovelhas)', icone: '🐑', unidade: 'cabeça' },
      { id: 'caprinos', nome: 'Caprinos (Cabras)', icone: '🐐', unidade: 'cabeça' },
      { id: 'peixes', nome: 'Peixes (Piscicultura)', icone: '🐟', unidade: 'kg' }
    ],
    temCotacao: true,
    campos: ['raca', 'peso', 'idade', 'genero', 'vacinacao', 'registro']
  },

  // 🌲 MADEIRA E FLORESTAL
  madeira: {
    id: 'madeira',
    nome: 'Madeira e Florestal',
    icone: '🌲',
    subcategorias: [
      { id: 'eucalipto', nome: 'Eucalipto', icone: '🌳', unidade: 'm³' },
      { id: 'pinus', nome: 'Pinus', icone: '🌲', unidade: 'm³' },
      { id: 'teca', nome: 'Teca', icone: '🌳', unidade: 'm³' },
      { id: 'madeira-nativa', nome: 'Madeira Nativa', icone: '🌴', unidade: 'm³' },
      { id: 'madeira-processada', nome: 'Madeira Processada', icone: '🪵', unidade: 'm³' },
      { id: 'lenha', nome: 'Lenha', icone: '🔥', unidade: 'st' },
      { id: 'carvao', nome: 'Carvão Vegetal', icone: '⚫', unidade: 'saca' },
      { id: 'serragem', nome: 'Serragem', icone: '🪚', unidade: 'm³' }
    ],
    campos: ['diametro', 'altura', 'volume', 'tipo_corte', 'secagem']
  },

  // 🥬 HORTIFRUTI
  hortifruti: {
    id: 'hortifruti',
    nome: 'Hortifrúti',
    icone: '🥬',
    subcategorias: [
      // Verduras
      { id: 'alface', nome: 'Alface', icone: '🥬', unidade: 'kg' },
      { id: 'couve', nome: 'Couve', icone: '🥬', unidade: 'kg' },
      { id: 'repolho', nome: 'Repolho', icone: '🥬', unidade: 'kg' },
      { id: 'brocolis', nome: 'Brócolis', icone: '🥦', unidade: 'kg' },
      { id: 'espinafre', nome: 'Espinafre', icone: '🥬', unidade: 'kg' },
      
      // Legumes
      { id: 'tomate', nome: 'Tomate', icone: '🍅', unidade: 'kg' },
      { id: 'batata', nome: 'Batata', icone: '🥔', unidade: 'kg' },
      { id: 'cenoura', nome: 'Cenoura', icone: '🥕', unidade: 'kg' },
      { id: 'cebola', nome: 'Cebola', icone: '🧅', unidade: 'kg' },
      { id: 'pimentao', nome: 'Pimentão', icone: '🫑', unidade: 'kg' },
      { id: 'abobrinha', nome: 'Abobrinha', icone: '🥒', unidade: 'kg' },
      { id: 'abobora', nome: 'Abóbora', icone: '🎃', unidade: 'kg' },
      
      // Frutas
      { id: 'laranja', nome: 'Laranja', icone: '🍊', unidade: 'kg' },
      { id: 'banana', nome: 'Banana', icone: '🍌', unidade: 'kg' },
      { id: 'manga', nome: 'Manga', icone: '🥭', unidade: 'kg' },
      { id: 'abacaxi', nome: 'Abacaxi', icone: '🍍', unidade: 'kg' },
      { id: 'melancia', nome: 'Melancia', icone: '🍉', unidade: 'kg' },
      { id: 'melao', nome: 'Melão', icone: '🍈', unidade: 'kg' },
      { id: 'morango', nome: 'Morango', icone: '🍓', unidade: 'kg' },
      { id: 'uva', nome: 'Uva', icone: '🍇', unidade: 'kg' }
    ],
    perecivel: true,
    campos: ['tipo_cultivo', 'organico', 'colheita', 'validade']
  },

  // 🌱 INSUMOS AGRÍCOLAS
  insumos: {
    id: 'insumos',
    nome: 'Insumos Agrícolas',
    icone: '🌱',
    subcategorias: [
      { id: 'fertilizantes', nome: 'Fertilizantes', icone: '💊', unidade: 'kg' },
      { id: 'defensivos', nome: 'Defensivos Agrícolas', icone: '🧪', unidade: 'L' },
      { id: 'herbicidas', nome: 'Herbicidas', icone: '🌿', unidade: 'L' },
      { id: 'fungicidas', nome: 'Fungicidas', icone: '🍄', unidade: 'L' },
      { id: 'inseticidas', nome: 'Inseticidas', icone: '🦟', unidade: 'L' },
      { id: 'sementes', nome: 'Sementes', icone: '🌱', unidade: 'kg' },
      { id: 'mudas', nome: 'Mudas', icone: '🌿', unidade: 'unidade' },
      { id: 'racao', nome: 'Ração Animal', icone: '🌾', unidade: 'kg' },
      { id: 'sal-mineral', nome: 'Sal Mineral', icone: '🧂', unidade: 'kg' },
      { id: 'vacinas', nome: 'Vacinas e Medicamentos', icone: '💉', unidade: 'unidade' }
    ],
    campos: ['composicao', 'registro_mapa', 'validade', 'dosagem']
  },

  // 🚜 MÁQUINAS E EQUIPAMENTOS
  maquinas: {
    id: 'maquinas',
    nome: 'Máquinas e Equipamentos',
    icone: '🚜',
    subcategorias: [
      { id: 'tratores', nome: 'Tratores', icone: '🚜', unidade: 'unidade' },
      { id: 'colheitadeiras', nome: 'Colheitadeiras', icone: '🌾', unidade: 'unidade' },
      { id: 'plantadeiras', nome: 'Plantadeiras', icone: '🌱', unidade: 'unidade' },
      { id: 'pulverizadores', nome: 'Pulverizadores', icone: '💦', unidade: 'unidade' },
      { id: 'arados', nome: 'Arados e Grades', icone: '🔧', unidade: 'unidade' },
      { id: 'distribuidores', nome: 'Distribuidores de Adubo', icone: '🌾', unidade: 'unidade' },
      { id: 'carretas', nome: 'Carretas Agrícolas', icone: '🚛', unidade: 'unidade' },
      { id: 'irrigacao', nome: 'Sistemas de Irrigação', icone: '💧', unidade: 'unidade' },
      { id: 'silos', nome: 'Silos e Armazéns', icone: '🏭', unidade: 'unidade' },
      { id: 'ordenhadeiras', nome: 'Ordenhadeiras', icone: '🥛', unidade: 'unidade' }
    ],
    campos: ['marca', 'modelo', 'ano', 'horas_uso', 'estado_conservacao', 'potencia']
  },

  // 🔧 PEÇAS E IMPLEMENTOS
  pecas: {
    id: 'pecas',
    nome: 'Peças e Implementos',
    icone: '🔧',
    subcategorias: [
      { id: 'pecas-trator', nome: 'Peças para Trator', icone: '⚙️', unidade: 'unidade' },
      { id: 'pecas-colheitadeira', nome: 'Peças para Colheitadeira', icone: '🔩', unidade: 'unidade' },
      { id: 'pneus', nome: 'Pneus Agrícolas', icone: '⭕', unidade: 'unidade' },
      { id: 'correntes', nome: 'Correntes e Correias', icone: '⛓️', unidade: 'unidade' },
      { id: 'filtros', nome: 'Filtros', icone: '🔍', unidade: 'unidade' },
      { id: 'ferramentas', nome: 'Ferramentas', icone: '🛠️', unidade: 'unidade' },
      { id: 'cercas', nome: 'Cercas e Alambrados', icone: '🚧', unidade: 'm' }
    ],
    campos: ['compatibilidade', 'marca', 'codigo_peca', 'garantia']
  },

  // 🏠 ANIMAIS PARA CRIAÇÃO
  animais: {
    id: 'animais',
    nome: 'Animais para Criação',
    icone: '🐄',
    subcategorias: [
      { id: 'bovinos-corte', nome: 'Bovinos de Corte', icone: '🐂', unidade: 'cabeça' },
      { id: 'bovinos-leite', nome: 'Bovinos de Leite', icone: '🐄', unidade: 'cabeça' },
      { id: 'equinos', nome: 'Equinos', icone: '🐴', unidade: 'cabeça' },
      { id: 'suinos', nome: 'Suínos', icone: '🐷', unidade: 'cabeça' },
      { id: 'aves-corte', nome: 'Aves de Corte', icone: '🐔', unidade: 'cabeça' },
      { id: 'aves-postura', nome: 'Aves de Postura', icone: '🥚', unidade: 'cabeça' },
      { id: 'ovinos', nome: 'Ovinos', icone: '🐑', unidade: 'cabeça' },
      { id: 'caprinos', nome: 'Caprinos', icone: '🐐', unidade: 'cabeça' },
      { id: 'peixes', nome: 'Peixes', icone: '🐟', unidade: 'kg' },
      { id: 'camarao', nome: 'Camarão', icone: '🦐', unidade: 'kg' },
      { id: 'abelhas', nome: 'Abelhas (Colmeias)', icone: '🐝', unidade: 'colmeia' },
      { id: 'coelhos', nome: 'Coelhos', icone: '🐰', unidade: 'cabeça' }
    ],
    campos: ['raca', 'peso', 'idade', 'genero', 'genealogia', 'vacinacao', 'registro']
  },

  // 🌳 FLORESTAL E MADEIRA
  florestal: {
    id: 'florestal',
    nome: 'Florestal e Madeira',
    icone: '🌲',
    subcategorias: [
      { id: 'eucalipto-em-pe', nome: 'Eucalipto em Pé', icone: '🌳', unidade: 'hectare' },
      { id: 'pinus-em-pe', nome: 'Pinus em Pé', icone: '🌲', unidade: 'hectare' },
      { id: 'tora-eucalipto', nome: 'Tora de Eucalipto', icone: '🪵', unidade: 'm³' },
      { id: 'tora-pinus', nome: 'Tora de Pinus', icone: '🪵', unidade: 'm³' },
      { id: 'madeira-serrada', nome: 'Madeira Serrada', icone: '📏', unidade: 'm³' },
      { id: 'madeira-beneficiada', nome: 'Madeira Beneficiada', icone: '✨', unidade: 'm²' },
      { id: 'lenha', nome: 'Lenha', icone: '🔥', unidade: 'st' },
      { id: 'carvao', nome: 'Carvão Vegetal', icone: '⚫', unidade: 'kg' },
      { id: 'mudas-florestais', nome: 'Mudas Florestais', icone: '🌱', unidade: 'unidade' }
    ],
    campos: ['diametro', 'altura', 'volume', 'umidade', 'tipo_corte', 'certificacao_florestal']
  },

  // 🍊 FRUTAS E HORTALIÇAS
  frutas: {
    id: 'frutas',
    nome: 'Frutas',
    icone: '🍊',
    subcategorias: [
      { id: 'citricos', nome: 'Cítricos (Laranja/Limão)', icone: '🍊', unidade: 'kg' },
      { id: 'banana', nome: 'Banana', icone: '🍌', unidade: 'kg' },
      { id: 'maca', nome: 'Maçã', icone: '🍎', unidade: 'kg' },
      { id: 'uva', nome: 'Uva', icone: '🍇', unidade: 'kg' },
      { id: 'manga', nome: 'Manga', icone: '🥭', unidade: 'kg' },
      { id: 'abacaxi', nome: 'Abacaxi', icone: '🍍', unidade: 'kg' },
      { id: 'melancia', nome: 'Melancia', icone: '🍉', unidade: 'kg' },
      { id: 'melao', nome: 'Melão', icone: '🍈', unidade: 'kg' },
      { id: 'morango', nome: 'Morango', icone: '🍓', unidade: 'kg' },
      { id: 'mirtilo', nome: 'Mirtilo', icone: '🫐', unidade: 'kg' },
      { id: 'abacate', nome: 'Abacate', icone: '🥑', unidade: 'kg' },
      { id: 'coco', nome: 'Coco', icone: '🥥', unidade: 'unidade' }
    ],
    perecivel: true,
    campos: ['calibre', 'classificacao', 'organico', 'colheita', 'validade']
  },

  // 🥕 LEGUMES E VERDURAS
  hortalicas: {
    id: 'hortalicas',
    nome: 'Hortaliças',
    icone: '🥕',
    subcategorias: [
      { id: 'batata', nome: 'Batata', icone: '🥔', unidade: 'kg' },
      { id: 'cenoura', nome: 'Cenoura', icone: '🥕', unidade: 'kg' },
      { id: 'cebola', nome: 'Cebola', icone: '🧅', unidade: 'kg' },
      { id: 'alho', nome: 'Alho', icone: '🧄', unidade: 'kg' },
      { id: 'mandioca', nome: 'Mandioca', icone: '🍠', unidade: 'kg' },
      { id: 'batata-doce', nome: 'Batata Doce', icone: '🍠', unidade: 'kg' },
      { id: 'beterraba', nome: 'Beterraba', icone: '🥕', unidade: 'kg' },
      { id: 'rabanete', nome: 'Rabanete', icone: '🔴', unidade: 'kg' },
      { id: 'nabo', nome: 'Nabo', icone: '⚪', unidade: 'kg' },
      { id: 'gengibre', nome: 'Gengibre', icone: '🫚', unidade: 'kg' }
    ],
    perecivel: true,
    campos: ['calibre', 'lavado', 'organico', 'colheita']
  },

  // 🍯 PRODUTOS DERIVADOS
  derivados: {
    id: 'derivados',
    nome: 'Produtos Derivados',
    icone: '🍯',
    subcategorias: [
      { id: 'leite', nome: 'Leite', icone: '🥛', unidade: 'L' },
      { id: 'queijo', nome: 'Queijo', icone: '🧀', unidade: 'kg' },
      { id: 'mel', nome: 'Mel', icone: '🍯', unidade: 'kg' },
      { id: 'ovos', nome: 'Ovos', icone: '🥚', unidade: 'dúzia' },
      { id: 'farinha', nome: 'Farinha', icone: '🌾', unidade: 'kg' },
      { id: 'acucar', nome: 'Açúcar', icone: '🍬', unidade: 'kg' },
      { id: 'oleos', nome: 'Óleos Vegetais', icone: '🫗', unidade: 'L' },
      { id: 'etanol', nome: 'Etanol', icone: '⛽', unidade: 'L' },
      { id: 'biodiesel', nome: 'Biodiesel', icone: '🌿', unidade: 'L' }
    ],
    campos: ['marca', 'validade', 'registro_sif', 'certificacao']
  },

  // 🌾 SEMENTES E MUDAS
  sementes: {
    id: 'sementes',
    nome: 'Sementes e Mudas',
    icone: '🌱',
    subcategorias: [
      { id: 'sementes-soja', nome: 'Sementes de Soja', icone: '🫘', unidade: 'saca' },
      { id: 'sementes-milho', nome: 'Sementes de Milho', icone: '🌽', unidade: 'saca' },
      { id: 'sementes-hortalicas', nome: 'Sementes de Hortaliças', icone: '🥬', unidade: 'g' },
      { id: 'sementes-pastagem', nome: 'Sementes de Pastagem', icone: '🌿', unidade: 'kg' },
      { id: 'mudas-frutiferas', nome: 'Mudas Frutíferas', icone: '🌳', unidade: 'unidade' },
      { id: 'mudas-cafe', nome: 'Mudas de Café', icone: '☕', unidade: 'unidade' },
      { id: 'mudas-hortalicas', nome: 'Mudas de Hortaliças', icone: '🌱', unidade: 'bandeja' }
    ],
    campos: ['cultivar', 'germinacao', 'tratamento', 'safra', 'certificacao']
  },

  // 🏡 PROPRIEDADES E TERRAS
  propriedades: {
    id: 'propriedades',
    nome: 'Propriedades e Terras',
    icone: '🏡',
    subcategorias: [
      { id: 'fazendas', nome: 'Fazendas', icone: '🏞️', unidade: 'hectare' },
      { id: 'sitios', nome: 'Sítios', icone: '🏡', unidade: 'hectare' },
      { id: 'chacaras', nome: 'Chácaras', icone: '🌳', unidade: 'hectare' },
      { id: 'terras-lavoura', nome: 'Terras para Lavoura', icone: '🌾', unidade: 'hectare' },
      { id: 'terras-pastagem', nome: 'Terras para Pastagem', icone: '🐄', unidade: 'hectare' },
      { id: 'florestas', nome: 'Florestas Plantadas', icone: '🌲', unidade: 'hectare' },
      { id: 'arrendamento', nome: 'Arrendamento', icone: '📝', unidade: 'hectare' }
    ],
    campos: ['area_total', 'area_agricultavel', 'tipo_solo', 'topografia', 'agua', 'benfeitorias', 'documentacao']
  },

  // 🎣 AQUICULTURA E PESCA
  aquicultura: {
    id: 'aquicultura',
    nome: 'Aquicultura',
    icone: '🐟',
    subcategorias: [
      { id: 'tilapia', nome: 'Tilápia', icone: '🐟', unidade: 'kg' },
      { id: 'tambaqui', nome: 'Tambaqui', icone: '🐠', unidade: 'kg' },
      { id: 'pacu', nome: 'Pacu', icone: '🐟', unidade: 'kg' },
      { id: 'pintado', nome: 'Pintado', icone: '🐠', unidade: 'kg' },
      { id: 'camarao', nome: 'Camarão', icone: '🦐', unidade: 'kg' },
      { id: 'alevinos', nome: 'Alevinos', icone: '🐟', unidade: 'milhar' },
      { id: 'racao-peixe', nome: 'Ração para Peixe', icone: '🌾', unidade: 'kg' }
    ],
    campos: ['tamanho', 'peso_medio', 'tanque', 'despesca']
  },

  // 🐝 APICULTURA E MEL
  apicultura: {
    id: 'apicultura',
    nome: 'Apicultura',
    icone: '🐝',
    subcategorias: [
      { id: 'mel', nome: 'Mel', icone: '🍯', unidade: 'kg' },
      { id: 'propolis', nome: 'Própolis', icone: '💊', unidade: 'g' },
      { id: 'geleia-real', nome: 'Geleia Real', icone: '✨', unidade: 'g' },
      { id: 'polen', nome: 'Pólen', icone: '🌼', unidade: 'g' },
      { id: 'cera', nome: 'Cera de Abelha', icone: '🕯️', unidade: 'kg' },
      { id: 'colmeias', nome: 'Colmeias', icone: '🏠', unidade: 'unidade' },
      { id: 'rainhas', nome: 'Abelhas Rainhas', icone: '👑', unidade: 'unidade' }
    ],
    campos: ['florada', 'pureza', 'sif', 'organico']
  },

  // 🛡️ SERVIÇOS AGRÍCOLAS
  servicos: {
    id: 'servicos',
    nome: 'Serviços Agrícolas',
    icone: '🛡️',
    subcategorias: [
      { id: 'pulverizacao', nome: 'Pulverização', icone: '💦', unidade: 'hectare' },
      { id: 'colheita', nome: 'Colheita', icone: '🌾', unidade: 'hectare' },
      { id: 'plantio', nome: 'Plantio', icone: '🌱', unidade: 'hectare' },
      { id: 'preparo-solo', nome: 'Preparo de Solo', icone: '🚜', unidade: 'hectare' },
      { id: 'analise-solo', nome: 'Análise de Solo', icone: '🔬', unidade: 'amostra' },
      { id: 'consultoria', nome: 'Consultoria Agronômica', icone: '👨‍🌾', unidade: 'hora' },
      { id: 'drone', nome: 'Pulverização com Drone', icone: '🚁', unidade: 'hectare' }
    ],
    campos: ['regiao_atendimento', 'disponibilidade', 'equipamentos']
  }
};

/**
 * Obter todas as categorias
 */
export function getAllCategorias() {
  return Object.values(CATEGORIAS_AGRO);
}

/**
 * Obter categoria por ID
 */
export function getCategoriaById(id) {
  return CATEGORIAS_AGRO[id] || null;
}

/**
 * Obter subcategorias de uma categoria
 */
export function getSubcategorias(categoriaId) {
  const categoria = CATEGORIAS_AGRO[categoriaId];
  return categoria ? categoria.subcategorias : [];
}

/**
 * Buscar categoria/subcategoria por texto
 */
export function searchCategoria(query) {
  const results = [];
  
  Object.values(CATEGORIAS_AGRO).forEach(categoria => {
    if (categoria.nome.toLowerCase().includes(query.toLowerCase())) {
      results.push(categoria);
    }
    
    categoria.subcategorias.forEach(sub => {
      if (sub.nome.toLowerCase().includes(query.toLowerCase())) {
        results.push({ ...sub, categoriaParent: categoria.id });
      }
    });
  });
  
  return results;
}

/**
 * Obter categorias com cotação
 */
export function getCategoriasComCotacao() {
  return Object.values(CATEGORIAS_AGRO).filter(c => c.temCotacao);
}

export default CATEGORIAS_AGRO;

