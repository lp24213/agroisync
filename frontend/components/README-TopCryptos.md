# Componente TopCryptos

Componente para exibir as principais criptomoedas do mercado com mini gráficos de 7 dias, integrado com a API Pro da CoinGecko.

## 📋 Funcionalidades

- ✅ **Tabela responsiva** com as principais criptomoedas
- ✅ **Mini gráficos** de 7 dias usando Chart.js
- ✅ **Atualização automática** a cada 5 minutos
- ✅ **Design responsivo** (desktop e mobile)
- ✅ **Estilo AGROTM** (preto fosco + azul neon)
- ✅ **Indicadores visuais** (verde/vermelho para variações)
- ✅ **Tratamento de erros** com retry automático
- ✅ **Loading states** com animações

## 🚀 Como Usar

### Importação Básica
```jsx
import TopCryptosWrapper from '@/components/TopCryptosWrapper';

export default function MyPage() {
  return (
    <div>
      <h2>Principais Criptos do Mercado</h2>
      <TopCryptosWrapper />
    </div>
  );
}
```

### Com Configurações Personalizadas
```jsx
import TopCryptosWrapper from '@/components/TopCryptosWrapper';

export default function MyPage() {
  return (
    <div>
      <TopCryptosWrapper 
        limit={10} 
        className="my-custom-class"
        forceMobile={false}
        forceDesktop={false}
      />
    </div>
  );
}
```

## 📱 Versões Disponíveis

### TopCryptosWrapper (Recomendado)
- Escolhe automaticamente entre desktop e mobile
- Responsivo por padrão
- Melhor experiência do usuário

### TopCryptos (Desktop)
- Tabela completa com todas as colunas
- Ideal para telas grandes
- Mais informações visíveis

### TopCryptosMobile (Mobile)
- Cards compactos
- Otimizado para telas pequenas
- Menos criptomoedas por padrão (máx 10)

## ⚙️ Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `limit` | `number` | `20` | Número de criptomoedas a exibir |
| `className` | `string` | `''` | Classes CSS adicionais |
| `forceMobile` | `boolean` | `false` | Força versão mobile |
| `forceDesktop` | `boolean` | `false` | Força versão desktop |

## 🎨 Estilo Visual

### Cores Utilizadas
- **Fundo**: `premium-black` (#000000)
- **Azul Neon**: `premium-neon-blue` (#00F0FF)
- **Verde Neon**: `premium-neon-green` (#00FF7F)
- **Vermelho**: `#FF6B35` (para variações negativas)
- **Texto**: `premium-light` (#ffffff)

### Tipografia
- **Títulos**: `font-orbitron` (fonte principal do AGROTM)
- **Dados**: `font-orbitron` para números importantes

### Gráficos
- **Positivo**: Verde neon com preenchimento suave
- **Negativo**: Vermelho com preenchimento suave
- **Linha**: Suave com tensão 0.4

## 🔧 API Integration

### Endpoint
```
GET https://pro-api.coingecko.com/api/v3/coins/markets
```

### Parâmetros
- `vs_currency=usd`
- `order=market_cap_desc`
- `per_page={limit}`
- `page=1`
- `sparkline=true`

### Headers
```
x-cg-pro-api-key: CG-BTkHrqswBAYJKoPMkqKSQLM4
```

## 📊 Dados Exibidos

### Colunas da Tabela (Desktop)
1. **Ranking** (#)
2. **Moeda** (Logo + Nome + Símbolo)
3. **Preço Atual** (USD)
4. **Variação 24h** (%)
5. **Market Cap** (formatado)
6. **Gráfico 7d** (mini sparkline)

### Cards Mobile
- Ranking + Logo + Nome/Símbolo
- Preço + Variação 24h
- Mini gráfico 7d

## 🔄 Atualizações

- **Automática**: A cada 5 minutos
- **Manual**: Botão de refresh
- **Indicador**: Mostra última atualização
- **Loading**: Animação durante atualização

## 🛠️ Dependências

- `axios` - Requisições HTTP
- `react-chartjs-2` - Gráficos
- `chart.js` - Biblioteca de gráficos
- `framer-motion` - Animações
- `lucide-react` - Ícones

## 🎯 Exemplo Completo

```jsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TopCryptosWrapper from '@/components/TopCryptosWrapper';

export default function CryptoPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-premium-neon-blue mb-4">
            Principais Criptomoedas
          </h1>
          <p className="text-xl text-premium-light/80">
            Acompanhe as principais criptomoedas do mercado em tempo real
          </p>
        </div>
        
        <TopCryptosWrapper 
          limit={15}
          className="shadow-2xl"
        />
      </div>
    </motion.div>
  );
}
```

## 🐛 Troubleshooting

### Erro de API
- Verifica se a chave da API está válida
- Tenta novamente automaticamente
- Mostra mensagem amigável

### Gráficos não carregam
- Verifica se Chart.js está registrado
- Confirma se os dados sparkline estão presentes
- Fallback para texto se necessário

### Performance
- Limita número de criptomoedas em mobile
- Usa lazy loading para gráficos
- Otimiza re-renders com React.memo

## 📝 Notas

- Componente totalmente responsivo
- Mantém identidade visual do AGROTM
- Integração perfeita com o design system
- Suporte a múltiplos idiomas (preparado para i18n)
- Acessível com ARIA labels
- SEO friendly
