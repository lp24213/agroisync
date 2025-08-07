# Integração com APIs Moralis e CoinCap

Este documento descreve como usar as integrações com as APIs Moralis (blockchain, NFTs, transações) e CoinCap (preços, gráficos, volume, market cap) no projeto AGROTM.

## Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```env
# Moralis API Key
NEXT_PUBLIC_MORALIS_API_KEY=seu_token_moralis_aqui

# Outras APIs já configuradas
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=sua_chave_alpha_vantage
NEXT_PUBLIC_QUANDL_API_KEY=sua_chave_quandl
NEXT_PUBLIC_YAHOO_FINANCE_API_KEY=sua_chave_yahoo_finance
NEXT_PUBLIC_FINNHUB_API_KEY=sua_chave_finnhub
```

## API Moralis

### Funcionalidades Disponíveis

- **NFTs**: Buscar NFTs de uma carteira específica
- **Transações**: Buscar histórico de transações
- **Saldos de Tokens**: Buscar saldos de tokens ERC-20
- **Metadados de NFT**: Buscar informações detalhadas de um NFT
- **Preços de Tokens**: Buscar preços de tokens em exchanges

### Exemplo de Uso

```tsx
import { useMoralis } from '../hooks/useMoralis';

function MyComponent() {
  const {
    nfts,
    nftsLoading,
    nftsError,
    fetchNfts,
    transactions,
    transactionsLoading,
    transactionsError,
    fetchTransactions
  } = useMoralis();

  useEffect(() => {
    // Buscar NFTs de uma carteira
    fetchNfts('0x1234567890123456789012345678901234567890');
    
    // Buscar transações de uma carteira
    fetchTransactions('0x1234567890123456789012345678901234567890');
  }, []);

  return (
    <div>
      {nftsLoading ? (
        <p>Carregando NFTs...</p>
      ) : nftsError ? (
        <p>Erro: {nftsError}</p>
      ) : (
        <div>
          <h3>NFTs ({nfts.length})</h3>
          {nfts.map((nft) => (
            <div key={`${nft.token_address}-${nft.token_id}`}>
              <p>{nft.metadata?.name || `NFT #${nft.token_id}`}</p>
              <p>{nft.symbol}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Funções Disponíveis

```typescript
// Buscar NFTs de uma carteira
const nfts = await getNftsByWallet(walletAddress, chain);

// Buscar transações de uma carteira
const transactions = await getTransactionsByWallet(walletAddress, chain);

// Buscar saldos de tokens
const tokenBalances = await getTokenBalances(walletAddress, chain);

// Buscar metadados de um NFT
const nftMetadata = await getNftMetadata(tokenAddress, tokenId, chain);

// Buscar preço de um token
const tokenPrice = await getTokenPrice(tokenAddress, chain);
```

## API CoinCap

### Funcionalidades Disponíveis

- **Preços**: Buscar preços atuais de criptomoedas
- **Gráficos**: Buscar histórico de preços
- **Ativos**: Listar todos os ativos disponíveis
- **Mercados**: Buscar dados de mercado de um ativo
- **Taxas de Câmbio**: Buscar taxas de câmbio

### Exemplo de Uso

```tsx
import { useCoinCap } from '../hooks/useCoinCap';

function CryptoPriceComponent() {
  const {
    cryptoPrice,
    cryptoPriceLoading,
    cryptoPriceError,
    fetchCryptoPrice,
    marketChart,
    marketChartLoading,
    marketChartError,
    fetchMarketChart
  } = useCoinCap();

  useEffect(() => {
    // Buscar preço do Bitcoin
    fetchCryptoPrice('bitcoin');
    
    // Buscar gráfico do Bitcoin (1 hora)
    fetchMarketChart('bitcoin', 'h1');
  }, []);

  return (
    <div>
      {cryptoPriceLoading ? (
        <p>Carregando preço...</p>
      ) : cryptoPriceError ? (
        <p>Erro: {cryptoPriceError}</p>
      ) : cryptoPrice ? (
        <div>
          <h3>{cryptoPrice.name} ({cryptoPrice.symbol})</h3>
          <p>Preço: ${parseFloat(cryptoPrice.priceUsd).toFixed(2)}</p>
          <p>Variação 24h: {parseFloat(cryptoPrice.changePercent24Hr).toFixed(2)}%</p>
          <p>Volume: ${parseFloat(cryptoPrice.volumeUsd24Hr).toLocaleString()}</p>
        </div>
      ) : null}
    </div>
  );
}
```

### Funções Disponíveis

```typescript
// Buscar preço de uma criptomoeda
const price = await getCryptoPrice('bitcoin');

// Buscar gráfico de mercado
const chart = await getCryptoMarketChart('bitcoin', 'h1');

// Buscar todos os ativos
const assets = await getAllAssets(100, 0);

// Buscar mercados de um ativo
const markets = await getAssetMarkets('bitcoin');

// Buscar taxa de câmbio
const rate = await getExchangeRate('bitcoin', 'ethereum');
```

## Componente de Exemplo

O projeto inclui um componente de exemplo `CryptoChart` que demonstra o uso integrado das duas APIs:

```tsx
import CryptoChart from '../components/CryptoChart';

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Componente com dados de criptomoedas */}
      <CryptoChart 
        walletAddress="0x1234567890123456789012345678901234567890"
        defaultAssetId="bitcoin"
      />
    </div>
  );
}
```

## Hooks Personalizados

### useMoralis

Hook para integração com a API Moralis:

```typescript
const {
  nfts,
  nftsLoading,
  nftsError,
  fetchNfts,
  transactions,
  transactionsLoading,
  transactionsError,
  fetchTransactions,
  tokenBalances,
  tokenBalancesLoading,
  tokenBalancesError,
  fetchTokenBalances,
  nftMetadata,
  nftMetadataLoading,
  nftMetadataError,
  fetchNftMetadata,
  tokenPrice,
  tokenPriceLoading,
  tokenPriceError,
  fetchTokenPrice
} = useMoralis();
```

### useCoinCap

Hook para integração com a API CoinCap:

```typescript
const {
  cryptoPrice,
  cryptoPriceLoading,
  cryptoPriceError,
  fetchCryptoPrice,
  marketChart,
  marketChartLoading,
  marketChartError,
  fetchMarketChart,
  allAssets,
  allAssetsLoading,
  allAssetsError,
  fetchAllAssets,
  assetMarkets,
  assetMarketsLoading,
  assetMarketsError,
  fetchAssetMarkets,
  exchangeRate,
  exchangeRateLoading,
  exchangeRateError,
  fetchExchangeRate,
  allExchangeRates,
  allExchangeRatesLoading,
  allExchangeRatesError,
  fetchAllExchangeRates
} = useCoinCap();
```

## Tratamento de Erros

Todas as funções incluem tratamento de erros robusto:

```typescript
try {
  const nfts = await getNftsByWallet(walletAddress);
  // Processar NFTs
} catch (error) {
  console.error('Erro ao buscar NFTs:', error);
  // Tratar erro (exibir mensagem para o usuário)
}
```

## Cache e Performance

- As APIs incluem cache interno para melhorar a performance
- Os hooks gerenciam estados de loading e erro automaticamente
- As requisições são otimizadas para evitar chamadas desnecessárias

## Limitações

### Moralis API
- Requer API key válida
- Limite de requisições por minuto (depende do plano)
- Suporte limitado a algumas chains

### CoinCap API
- Dados em tempo real (sem delay)
- Limite de requisições por minuto
- Alguns endpoints podem ter latência

## Próximos Passos

1. Configure as variáveis de ambiente
2. Teste as integrações com dados reais
3. Implemente gráficos interativos usando bibliotecas como Recharts ou Chart.js
4. Adicione mais funcionalidades conforme necessário
5. Implemente cache persistente para melhor performance

## Suporte

Para dúvidas ou problemas com as integrações:

1. Verifique se as variáveis de ambiente estão configuradas corretamente
2. Consulte a documentação oficial das APIs:
   - [Moralis API](https://docs.moralis.io/)
   - [CoinCap API](https://docs.coincap.io/)
3. Verifique os logs do console para erros detalhados
4. Entre em contato com a equipe de desenvolvimento
