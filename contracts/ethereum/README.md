# Sistema de Compra com Comissão - AGROTM

Este diretório contém os contratos inteligentes e scripts para o sistema de compra com comissão da plataforma AGROTM. O sistema permite que usuários comprem tokens (ERC-20) e NFTs (ERC-721 e ERC-1155) com uma comissão automática enviada para um endereço de administrador.

## Estrutura do Projeto

```
├── contracts/
│   ├── BuyWithCommission.sol     # Contrato principal para compras com comissão
│   └── mocks/                    # Contratos mock para testes
│       ├── MockERC20.sol         # Mock de token ERC-20
│       ├── MockERC721.sol        # Mock de NFT ERC-721
│       └── MockERC1155.sol       # Mock de NFT ERC-1155
├── scripts/
│   └── deployCommissionContract.ts  # Script de deploy do contrato
├── test/
│   └── BuyWithCommission.test.ts    # Testes do contrato
├── hardhat.config.ts            # Configuração do Hardhat
├── .env.example                 # Exemplo de variáveis de ambiente
└── package.json                 # Dependências e scripts
```

## Funcionalidades

- **Compra de Tokens ERC-20**: Permite aos usuários comprar tokens ERC-20 com uma comissão automática.
- **Compra de NFTs ERC-721**: Permite aos usuários comprar NFTs únicos com uma comissão automática.
- **Compra de NFTs ERC-1155**: Permite aos usuários comprar NFTs multi-token com uma comissão automática.
- **Comissão Configurável**: O proprietário do contrato pode ajustar a taxa de comissão (limitada a 30%).
- **Administrador Configurável**: O proprietário do contrato pode alterar o endereço do administrador que recebe as comissões.
- **Pausável**: O contrato pode ser pausado em caso de emergência.
- **Segurança**: Implementa proteções contra reentrancy e overflow, além de controle de acesso.

## Contratos

### BuyWithCommission.sol

O contrato principal que gerencia as compras com comissão. Ele implementa as seguintes interfaces:

- `Ownable`: Para controle de acesso às funções administrativas.
- `ReentrancyGuard`: Para proteção contra ataques de reentrancy.
- `Pausable`: Para permitir pausar o contrato em caso de emergência.

Funções principais:

- `buyTokenWithCommission`: Compra tokens ERC-20 com comissão.
- `buyNFTWithCommission`: Compra NFTs ERC-721 com comissão.
- `buyERC1155WithCommission`: Compra NFTs ERC-1155 com comissão.
- `setCommissionRate`: Define a taxa de comissão (apenas proprietário).
- `setAdminAddress`: Define o endereço do administrador (apenas proprietário).
- `pause` / `unpause`: Pausa/despausa o contrato (apenas proprietário).
- `withdraw`: Permite ao proprietário sacar fundos do contrato.

## Instalação e Uso

### Pré-requisitos

- Node.js (v14+)
- npm ou yarn

### Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
cd contracts/ethereum
npm install
# ou
yarn install
```

3. Copie o arquivo `.env.example` para `.env` e preencha as variáveis:

```bash
cp .env.example .env
```

### Compilação

```bash
npm run compile
# ou
yarn compile
```

### Testes

```bash
npm test
# ou
yarn test
```

### Deploy

#### Rede Local

```bash
npm run deploy:local
# ou
yarn deploy:local
```

#### Testnet (Goerli, BSC Testnet, etc.)

```bash
npm run deploy:goerli
# ou
yarn deploy:bsctest
```

#### Mainnet

```bash
npm run deploy:bsc
# ou
yarn deploy:polygon
```

### Verificação

Após o deploy, você pode verificar o contrato no explorador de blocos:

```bash
npm run verify:bsc <ENDERECO_DO_CONTRATO> <TAXA_DE_COMISSAO> <ENDERECO_DO_ADMIN>
# ou
yarn verify:polygon <ENDERECO_DO_CONTRATO> <TAXA_DE_COMISSAO> <ENDERECO_DO_ADMIN>
```

## Integração com Frontend

O contrato pode ser integrado ao frontend usando a biblioteca ethers.js ou web3.js. Um componente React `BuyWithCommission.tsx` está disponível em `frontend/components/` para facilitar a integração.

## Segurança

O contrato implementa várias medidas de segurança:

- Proteção contra reentrancy usando o modificador `nonReentrant`
- Controle de acesso usando o contrato `Ownable`
- Validação de entradas para evitar overflow/underflow
- Capacidade de pausar o contrato em caso de emergência
- Limite máximo para a taxa de comissão (30%)

## Licença

MIT