const express = require('express');
const router = express.Router();
const { AgroConecta, Loja, Marketplace, Fazenda } = require('../models/Registration');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting para APIs externas
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas tentativas de acesso. Tente novamente em 15 minutos.'
});

// Rate limiting para cadastros
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 5 cadastros por IP por hora
  message: 'Muitos cadastros realizados. Tente novamente em 1 hora.'
});

// Função para buscar dados por CEP
const fetchCEPData = async cep => {
  try {
    // Simular API dos Correios (substituir por API real)
    const cleanCEP = cep.replace(/\D/g, '');

    if (cleanCEP.length !== 8) {
      throw new Error('CEP inválido');
    }

    // Mock data - substituir por chamada real para API dos Correios
    const mockData = {
      cep,
      logradouro: 'Avenida Paulista',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107'
    };

    return mockData;
  } catch (error) {
    throw new Error(`Erro ao buscar CEP: ${error.message}`);
  }
};

// Função para validar CPF na Receita Federal
const validateCPF = async cpf => {
  try {
    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11) {
      throw new Error('CPF deve ter 11 dígitos');
    }

    // Simular validação na Receita Federal
    // Em produção, usar API real da Receita Federal
    const isValid = true; // Mock validation

    if (!isValid) {
      throw new Error('CPF inválido na Receita Federal');
    }

    return {
      isValid: true,
      status: 'VALID',
      name: 'Nome da Pessoa', // Mock - em produção viria da API
      birthDate: '1990-01-01' // Mock
    };
  } catch (error) {
    throw new Error(`Erro ao validar CPF: ${error.message}`);
  }
};

// Função para validar CNPJ na Receita Federal
const validateCNPJ = async cnpj => {
  try {
    const cleanCNPJ = cnpj.replace(/\D/g, '');

    if (cleanCNPJ.length !== 14) {
      throw new Error('CNPJ deve ter 14 dígitos');
    }

    // Simular validação na Receita Federal
    // Em produção, usar API real da Receita Federal
    const isValid = true; // Mock validation

    if (!isValid) {
      throw new Error('CNPJ inválido na Receita Federal');
    }

    return {
      isValid: true,
      status: 'ATIVA',
      companyName: 'Empresa Exemplo LTDA', // Mock - em produção viria da API
      fantasyName: 'Empresa Exemplo',
      openingDate: '2020-01-01',
      ie: '123.456.789.012',
      address: {
        street: 'Rua das Flores, 123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000-000'
      },
      activities: ['Comércio de produtos agrícolas'],
      capital: 100000
    };
  } catch (error) {
    throw new Error(`Erro ao validar CNPJ: ${error.message}`);
  }
};

// Função para buscar localização por IP
const fetchLocationByIP = async ip => {
  try {
    // Simular busca por IP (substituir por API real como ipapi.co)
    const mockData = {
      ip,
      city: 'São Paulo',
      region: 'São Paulo',
      country: 'BR',
      country_name: 'Brazil',
      postal: '01000-000',
      latitude: -23.5505,
      longitude: -46.6333,
      timezone: 'America/Sao_Paulo'
    };

    return mockData;
  } catch (error) {
    throw new Error(`Erro ao buscar localização: ${error.message}`);
  }
};

// Função para buscar produtos por API
const searchProducts = async query => {
  try {
    // Simular busca de produtos (substituir por API real)
    const mockProducts = [
      {
        id: '1',
        name: 'Soja',
        category: 'Grãos',
        unit: 'saca',
        description: 'Soja para alimentação animal'
      },
      {
        id: '2',
        name: 'Milho',
        category: 'Grãos',
        unit: 'saca',
        description: 'Milho para alimentação animal'
      },
      {
        id: '3',
        name: 'Trigo',
        category: 'Grãos',
        unit: 'saca',
        description: 'Trigo para panificação'
      },
      { id: '4', name: 'Café', category: 'Bebidas', unit: 'kg', description: 'Café em grão' },
      { id: '5', name: 'Açúcar', category: 'Dulçor', unit: 'kg', description: 'Açúcar cristal' },
      {
        id: '6',
        name: 'Fertilizante NPK',
        category: 'Insumos',
        unit: 'kg',
        description: 'Fertilizante NPK 20-10-10'
      },
      {
        id: '7',
        name: 'Sementes de Soja',
        category: 'Insumos',
        unit: 'kg',
        description: 'Sementes de soja certificadas'
      },
      {
        id: '8',
        name: 'Defensivo Agrícola',
        category: 'Insumos',
        unit: 'L',
        description: 'Defensivo para controle de pragas'
      }
    ];

    const filtered = mockProducts.filter(
      product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );

    return filtered;
  } catch (error) {
    throw new Error(`Erro ao buscar produtos: ${error.message}`);
  }
};

// GET /api/registration/cep/:cep - Buscar dados por CEP
router.get('/cep/:cep', apiLimiter, async (req, res) => {
  try {
    const { cep } = req.params;
    const data = await fetchCEPData(cep);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/registration/validate/cpf/:cpf - Validar CPF
router.get('/validate/cpf/:cpf', apiLimiter, async (req, res) => {
  try {
    const { cpf } = req.params;
    const data = await validateCPF(cpf);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/registration/validate/cnpj/:cnpj - Validar CNPJ
router.get('/validate/cnpj/:cnpj', apiLimiter, async (req, res) => {
  try {
    const { cnpj } = req.params;
    const data = await validateCNPJ(cnpj);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/registration/location/:ip - Buscar localização por IP
router.get('/location/:ip', apiLimiter, async (req, res) => {
  try {
    const { ip } = req.params;
    const data = await fetchLocationByIP(ip);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/registration/products/search/:query - Buscar produtos
router.get('/products/search/:query', apiLimiter, async (req, res) => {
  try {
    const { query } = req.params;
    const products = await searchProducts(query);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/registration/agroconecta - Cadastrar no AgroConecta
router.post('/agroconecta', registrationLimiter, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      cpf,
      companyName,
      cnpj,
      ie,
      address,
      vehicle,
      services,
      plan,
      isPublic
    } = req.body;

    // Verificar se já existe cadastro
    const existingEmail = await AgroConecta.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    const existingCPF = await AgroConecta.findOne({ cpf });
    if (existingCPF) {
      return res.status(400).json({
        success: false,
        message: 'CPF já cadastrado'
      });
    }

    const existingCNPJ = await AgroConecta.findOne({ cnpj });
    if (existingCNPJ) {
      return res.status(400).json({
        success: false,
        message: 'CNPJ já cadastrado'
      });
    }

    // Criar novo cadastro
    const newAgroConecta = new AgroConecta({
      name,
      email,
      phone,
      cpf,
      companyName,
      cnpj,
      ie,
      address,
      vehicle,
      services,
      plan,
      isPublic
    });

    await newAgroConecta.save();

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso',
      data: {
        id: newAgroConecta._id,
        email: newAgroConecta.email,
        plan: newAgroConecta.plan
      }
    });
  } catch (error) {
    console.error('Erro ao cadastrar AgroConecta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST /api/registration/loja - Cadastrar na Loja
router.post('/loja', registrationLimiter, async (req, res) => {
  try {
    const { name, email, phone, cpf, companyName, cnpj, ie, address, products, plan, isPublic } =
      req.body;

    // Verificar se já existe cadastro
    const existingEmail = await Loja.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    const existingCPF = await Loja.findOne({ cpf });
    if (existingCPF) {
      return res.status(400).json({
        success: false,
        message: 'CPF já cadastrado'
      });
    }

    const existingCNPJ = await Loja.findOne({ cnpj });
    if (existingCNPJ) {
      return res.status(400).json({
        success: false,
        message: 'CNPJ já cadastrado'
      });
    }

    // Criar novo cadastro
    const newLoja = new Loja({
      name,
      email,
      phone,
      cpf,
      companyName,
      cnpj,
      ie,
      address,
      products,
      plan,
      isPublic
    });

    await newLoja.save();

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso',
      data: {
        id: newLoja._id,
        email: newLoja.email,
        plan: newLoja.plan
      }
    });
  } catch (error) {
    console.error('Erro ao cadastrar Loja:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST /api/registration/marketplace - Cadastrar no Marketplace
router.post('/marketplace', registrationLimiter, async (req, res) => {
  try {
    const { name, email, phone, cpf, companyName, cnpj, ie, address, offerings, plan, isPublic } =
      req.body;

    // Verificar se já existe cadastro
    const existingEmail = await Marketplace.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    const existingCPF = await Marketplace.findOne({ cpf });
    if (existingCPF) {
      return res.status(400).json({
        success: false,
        message: 'CPF já cadastrado'
      });
    }

    const existingCNPJ = await Marketplace.findOne({ cnpj });
    if (existingCNPJ) {
      return res.status(400).json({
        success: false,
        message: 'CNPJ já cadastrado'
      });
    }

    // Criar novo cadastro
    const newMarketplace = new Marketplace({
      name,
      email,
      phone,
      cpf,
      companyName,
      cnpj,
      ie,
      address,
      offerings,
      plan,
      isPublic
    });

    await newMarketplace.save();

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso',
      data: {
        id: newMarketplace._id,
        email: newMarketplace.email,
        plan: newMarketplace.plan
      }
    });
  } catch (error) {
    console.error('Erro ao cadastrar Marketplace:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// POST /api/registration/fazenda - Cadastrar Fazenda
router.post('/fazenda', registrationLimiter, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      cpf,
      farmName,
      farmSize,
      farmType,
      address,
      products,
      plan,
      isPublic
    } = req.body;

    // Verificar se já existe cadastro
    const existingEmail = await Fazenda.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    const existingCPF = await Fazenda.findOne({ cpf });
    if (existingCPF) {
      return res.status(400).json({
        success: false,
        message: 'CPF já cadastrado'
      });
    }

    // Criar novo cadastro
    const newFazenda = new Fazenda({
      name,
      email,
      phone,
      cpf,
      farmName,
      farmSize,
      farmType,
      address,
      products,
      plan,
      isPublic
    });

    await newFazenda.save();

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso',
      data: {
        id: newFazenda._id,
        email: newFazenda.email,
        plan: newFazenda.plan
      }
    });
  } catch (error) {
    console.error('Erro ao cadastrar Fazenda:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/registration/agroconecta/public - Listar cadastros públicos do AgroConecta
router.get('/agroconecta/public', async (req, res) => {
  try {
    const { page = 1, limit = 20, city, state, vehicleType } = req.query;

    const filter = { isPublic: true, isActive: true };

    if (city) {
      filter['address.city'] = new RegExp(city, 'i');
    }
    if (state) {
      filter['address.state'] = state;
    }
    if (vehicleType) {
      filter['vehicle.type'] = vehicleType;
    }

    const skip = (page - 1) * limit;

    const [agroconectas, total] = await Promise.all([
      AgroConecta.find(filter)
        .select('name companyName address vehicle services stats plan')
        .skip(skip)
        .limit(parseInt(limit, 10))
        .sort({ createdAt: -1 }),
      AgroConecta.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: agroconectas,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar AgroConecta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/registration/loja/public - Listar cadastros públicos da Loja
router.get('/loja/public', async (req, res) => {
  try {
    const { page = 1, limit = 20, city, state, category } = req.query;

    const filter = { isPublic: true, isActive: true };

    if (city) {
      filter['address.city'] = new RegExp(city, 'i');
    }
    if (state) {
      filter['address.state'] = state;
    }

    const skip = (page - 1) * limit;

    const [lojas, total] = await Promise.all([
      Loja.find(filter)
        .select('name companyName address products stats plan')
        .skip(skip)
        .limit(parseInt(limit, 10))
        .sort({ createdAt: -1 }),
      Loja.countDocuments(filter)
    ]);

    // Filtrar produtos por categoria se especificado
    if (category) {
      lojas.forEach(loja => {
        loja.products = loja.products.filter(product =>
          product.category.toLowerCase().includes(category.toLowerCase())
        );
      });
    }

    res.json({
      success: true,
      data: lojas,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar Lojas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/registration/marketplace/public - Listar cadastros públicos do Marketplace
router.get('/marketplace/public', async (req, res) => {
  try {
    const { page = 1, limit = 20, city, state, type } = req.query;

    const filter = { isPublic: true, isActive: true };

    if (city) {
      filter['address.city'] = new RegExp(city, 'i');
    }
    if (state) {
      filter['address.state'] = state;
    }

    const skip = (page - 1) * limit;

    const [marketplaces, total] = await Promise.all([
      Marketplace.find(filter)
        .select('name companyName address offerings stats plan')
        .skip(skip)
        .limit(parseInt(limit, 10))
        .sort({ createdAt: -1 }),
      Marketplace.countDocuments(filter)
    ]);

    // Filtrar ofertas por tipo se especificado
    if (type) {
      marketplaces.forEach(marketplace => {
        marketplace.offerings = marketplace.offerings.filter(offering => offering.type === type);
      });
    }

    res.json({
      success: true,
      data: marketplaces,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar Marketplaces:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// GET /api/registration/fazenda/public - Listar cadastros públicos de Fazendas
router.get('/fazenda/public', async (req, res) => {
  try {
    const { page = 1, limit = 20, city, state, farmType } = req.query;

    const filter = { isPublic: true, isActive: true };

    if (city) {
      filter['address.city'] = new RegExp(city, 'i');
    }
    if (state) {
      filter['address.state'] = state;
    }
    if (farmType) {
      filter.farmType = farmType;
    }

    const skip = (page - 1) * limit;

    const [fazendas, total] = await Promise.all([
      Fazenda.find(filter)
        .select('name farmName farmSize farmType address products stats plan')
        .skip(skip)
        .limit(parseInt(limit, 10))
        .sort({ createdAt: -1 }),
      Fazenda.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: fazendas,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar Fazendas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router;
