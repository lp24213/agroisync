# Integração MongoDB - Agroisync

## Visão Geral

Este documento descreve a implementação da integração com MongoDB para as páginas **Loja de Produtos** e **AgroConecta (Fretes)** do site Agroisync, conforme solicitado nas instruções.

## Funcionalidades Implementadas

### 1. Backend MongoDB

#### Modelos Criados

**Product Model** (`backend/src/models/Product.js`)
- Nome, tipo (soja, milho, café, algodão, insumo, maquinário)
- Preço, quantidade mínima, descrição detalhada
- Classificação de qualidade (proteína, umidade, impurezas, cor)
- Informações do vendedor (nome, email, telefone, CPF/CNPJ)
- Localização (cidade, estado, país)
- Imagens SVG
- Timestamps de criação e atualização

**Freight Model** (`backend/src/models/Freight.js`)
- Produto (nome, tipo, peso, unidade)
- Quantidade, origem, destino
- Tipo de caminhão, valor do frete, prazo de entrega
- Informações da transportadora (nome, CPF/CNPJ, telefone, email, placa)
- Status do frete (disponível, em negociação, assignado, em trânsito, entregue, cancelado)
- Timestamps de criação e atualização

#### Rotas da API

**Products API** (`/api/products`)
- `GET /` - Listar produtos com filtros
- `GET /:id` - Obter produto por ID
- `POST /` - Criar novo produto
- `PUT /:id` - Atualizar produto
- `DELETE /:id` - Remover produto (soft delete)

**Freights API** (`/api/freights`)
- `GET /` - Listar fretes com filtros
- `GET /:id` - Obter frete por ID
- `POST /` - Criar novo frete
- `PUT /:id` - Atualizar frete
- `DELETE /:id` - Remover frete (soft delete)
- `PUT /:id/status` - Atualizar status do frete

#### Configuração MongoDB

**Database Connection** (`backend/src/config/mongodb.js`)
- Conexão configurável via variáveis de ambiente
- Tratamento de eventos de conexão
- Fallback para modo offline em caso de falha
- Pool de conexões otimizado

### 2. Frontend Integration

#### Serviços Criados

**Product Service** (`frontend/src/services/productService.js`)
- Integração com API de produtos
- Filtros por tipo, preço, localização, busca
- Tratamento de erros e fallbacks
- Timeout configurável

**Freight Service** (`frontend/src/services/freightService.js`)
- Integração com API de fretes
- Filtros por produto, origem, destino, tipo de caminhão, valor
- Tratamento de erros e fallbacks
- Atualização de status

#### Páginas Atualizadas

**Loja de Produtos** (`frontend/src/pages/Loja.js`)
- ✅ Integração com MongoDB via `productService`
- ✅ Exibição de produtos em tempo real
- ✅ Filtros funcionais (categoria, preço, localização, busca)
- ✅ Estados de carregamento, erro e vazio
- ✅ Botão "Cadastrar Produto" funcional
- ✅ Categorias padronizadas conforme modelo MongoDB
- ✅ Ícones correspondentes ao tipo do produto

**AgroConecta** (`frontend/src/pages/AgroConecta.js`)
- ✅ Integração com MongoDB via `freightService`
- ✅ Exibição de fretes em tempo real
- ✅ Filtros funcionais (produto, origem, destino, tipo de caminhão, valor)
- ✅ Estados de carregamento, erro e vazio
- ✅ Botão "Cadastrar Frete" funcional
- ✅ Status de fretes com cores e textos apropriados
- ✅ Informações completas de transportadoras

## Configuração

### 1. Variáveis de Ambiente

**Backend** (`.env`)
```bash
MONGODB_URI=mongodb://localhost:27017/agroisync
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`.env.local`)
```bash
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENABLE_MONGODB=true
```

### 2. Instalação de Dependências

**Backend**
```bash
cd backend
npm install mongoose
```

**Frontend**
```bash
cd frontend
npm install axios
```

### 3. Inicialização do MongoDB

```bash
# Instalar MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Iniciar serviço
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verificar status
sudo systemctl status mongodb

# Acessar shell
mongo
```

## Uso

### 1. Iniciar Backend

```bash
cd backend
npm run dev
```

### 2. Iniciar Frontend

```bash
cd frontend
npm start
```

### 3. Testar APIs

**Produtos**
```bash
# Listar produtos
curl http://localhost:3001/api/products

# Criar produto
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Soja Tipo 1",
    "type": "soja",
    "price": 180.50,
    "minimumQuantity": 10,
    "description": "Soja de alta qualidade",
    "seller": {
      "name": "Produtor MT",
      "email": "produtor@mt.com",
      "cpfCnpj": "12345678901"
    },
    "location": {
      "city": "Sinop",
      "state": "MT"
    }
  }'
```

**Fretes**
```bash
# Listar fretes
curl http://localhost:3001/api/freights

# Criar frete
curl -X POST http://localhost:3001/api/freights \
  -H "Content-Type: application/json" \
  -d '{
    "product": {
      "name": "Soja",
      "type": "soja",
      "weight": 30,
      "unit": "ton"
    },
    "quantity": 500,
    "origin": {
      "city": "Sinop",
      "state": "MT"
    },
    "destination": {
      "city": "Santos",
      "state": "SP"
    },
    "truckType": "truck",
    "freightValue": 8500.00,
    "deliveryTime": 3,
    "carrier": {
      "name": "Transportadora MT",
      "cpfCnpj": "12345678901",
      "phone": "(66) 99999-9999",
      "email": "transporte@mt.com",
      "truckLicensePlate": "ABC-1234"
    }
  }'
```

## Estrutura de Dados

### Product Schema
```javascript
{
  name: String,           // Nome do produto
  type: String,           // soja, milho, café, algodão, insumo, maquinário
  price: Number,          // Preço
  minimumQuantity: Number, // Quantidade mínima
  description: String,    // Descrição detalhada
  quality: {
    protein: Number,      // Proteína (%)
    humidity: Number,     // Umidade (%)
    impurities: Number,   // Impurezas (%)
    color: String         // Cor
  },
  seller: {
    name: String,         // Nome do vendedor
    email: String,        // Email
    phone: String,        // Telefone
    cpfCnpj: String      // CPF/CNPJ
  },
  location: {
    city: String,         // Cidade
    state: String,        // Estado
    country: String       // País
  },
  images: [String],       // URLs das imagens SVG
  isActive: Boolean,      // Status ativo
  createdAt: Date,        // Data de criação
  updatedAt: Date         // Data de atualização
}
```

### Freight Schema
```javascript
{
  product: {
    name: String,         // Nome do produto
    type: String,         // Tipo do produto
    weight: Number,       // Peso
    unit: String          // Unidade (kg, ton, sacas)
  },
  quantity: Number,       // Quantidade
  origin: {
    city: String,         // Cidade de origem
    state: String,        // Estado de origem
    country: String       // País de origem
  },
  destination: {
    city: String,         // Cidade de destino
    state: String,        // Estado de destino
    country: String       // País de destino
  },
  truckType: String,      // Tipo de caminhão
  freightValue: Number,   // Valor do frete
  deliveryTime: Number,   // Prazo de entrega (dias)
  carrier: {
    name: String,         // Nome da transportadora
    cpfCnpj: String,     // CPF/CNPJ
    phone: String,        // Telefone
    email: String,        // Email
    truckLicensePlate: String // Placa do caminhão
  },
  status: String,         // Status do frete
  isActive: Boolean,      // Status ativo
  createdAt: Date,        // Data de criação
  updatedAt: Date         // Data de atualização
}
```

## Funcionalidades Implementadas

### ✅ Concluído
- [x] Modelos MongoDB para Produtos e Fretes
- [x] APIs RESTful completas com CRUD
- [x] Integração frontend-backend
- [x] Filtros e busca em tempo real
- [x] Estados de carregamento, erro e vazio
- [x] Botões "Cadastrar Produto" e "Cadastrar Frete"
- [x] Categorias padronizadas
- [x] Ícones correspondentes aos tipos
- [x] Tratamento de erros robusto
- [x] Fallbacks para modo offline

### 🔄 Em Desenvolvimento
- [ ] Formulários de cadastro de produtos
- [ ] Formulários de cadastro de fretes
- [ ] Sistema de mensageria entre comprador/vendedor/transportadora
- [ ] Integração com Stripe para pagamentos
- [ ] Sistema de planos mensais
- [ ] Upload de imagens SVG

### 📋 Próximos Passos
1. Implementar formulários de cadastro
2. Criar sistema de mensageria
3. Integrar pagamentos Stripe
4. Implementar sistema de planos
5. Adicionar upload de imagens
6. Implementar notificações em tempo real

## Troubleshooting

### Erro de Conexão MongoDB
```bash
# Verificar se MongoDB está rodando
sudo systemctl status mongodb

# Verificar logs
sudo journalctl -u mongodb

# Reiniciar serviço
sudo systemctl restart mongodb
```

### Erro de CORS
```bash
# Verificar variável CORS_ORIGIN no backend
# Deve apontar para a URL do frontend
CORS_ORIGIN=http://localhost:3000
```

### Erro de API
```bash
# Verificar logs do backend
cd backend
npm run dev

# Verificar se a porta está correta
# Backend: 3001, Frontend: 3000
```

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste localmente
5. Faça commit e push
6. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

**Desenvolvido pela Equipe Agroisync** 🚀
