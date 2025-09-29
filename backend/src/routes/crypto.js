import express from 'express';
import crypto from 'crypto';
import logger from '../utils/logger.js';

const router = express.Router();

// Middleware de autenticação para rotas criptografadas
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticação necessário'
    });
  }
  // Aqui você validaria o JWT token
  next();
};

// Gerar chaves de criptografia
router.post('/generate-keys', requireAuth, async (req, res) => {
  try {
    const { algorithm = 'aes-256-gcm' } = req.body;

    // Gerar chave simétrica
    const symmetricKey = crypto.randomBytes(32);

    // Gerar par de chaves assimétricas
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    const keyData = {
      symmetricKey: symmetricKey.toString('base64'),
      publicKey,
      privateKey,
      algorithm,
      timestamp: new Date().toISOString()
    };

    logger.info('Chaves de criptografia geradas com sucesso');

    res.json({
      success: true,
      message: 'Chaves geradas com sucesso',
      data: keyData
    });
  } catch (error) {
    logger.error('Erro ao gerar chaves:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Criptografar dados
router.post('/encrypt', requireAuth, async (req, res) => {
  try {
    const { data, key, algorithm = 'aes-256-gcm' } = req.body;

    if (!data || !key) {
      return res.status(400).json({
        success: false,
        message: 'Dados e chave são obrigatórios'
      });
    }

    const keyBuffer = Buffer.from(key, 'base64');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, keyBuffer);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag ? cipher.getAuthTag() : null;

    const encryptedData = {
      encrypted,
      iv: iv.toString('base64'),
      algorithm,
      authTag: authTag ? authTag.toString('base64') : null,
      timestamp: new Date().toISOString()
    };

    logger.info('Dados criptografados com sucesso');

    res.json({
      success: true,
      message: 'Dados criptografados com sucesso',
      data: encryptedData
    });
  } catch (error) {
    logger.error('Erro ao criptografar dados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criptografar dados'
    });
  }
});

// Descriptografar dados
router.post('/decrypt', requireAuth, async (req, res) => {
  try {
    const { encryptedData, key } = req.body;

    if (!encryptedData || !key) {
      return res.status(400).json({
        success: false,
        message: 'Dados criptografados e chave são obrigatórios'
      });
    }

    const keyBuffer = Buffer.from(key, 'base64');
    const iv = Buffer.from(encryptedData.iv, 'base64');
    const decipher = crypto.createDecipher(encryptedData.algorithm, keyBuffer);

    if (encryptedData.authTag) {
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'base64'));
    }

    let decrypted = decipher.update(encryptedData.encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    const data = JSON.parse(decrypted);

    logger.info('Dados descriptografados com sucesso');

    res.json({
      success: true,
      message: 'Dados descriptografados com sucesso',
      data
    });
  } catch (error) {
    logger.error('Erro ao descriptografar dados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao descriptografar dados'
    });
  }
});

// Hash de dados
router.post('/hash', requireAuth, async (req, res) => {
  try {
    const { data, algorithm = 'sha256' } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Dados são obrigatórios'
      });
    }

    const hash = crypto.createHash(algorithm);
    hash.update(JSON.stringify(data));
    const hashValue = hash.digest('hex');

    logger.info('Hash gerado com sucesso');

    res.json({
      success: true,
      message: 'Hash gerado com sucesso',
      data: {
        hash: hashValue,
        algorithm,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Erro ao gerar hash:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar hash'
    });
  }
});

// Verificar integridade
router.post('/verify-integrity', requireAuth, async (req, res) => {
  try {
    const { data, hash, algorithm = 'sha256' } = req.body;

    if (!data || !hash) {
      return res.status(400).json({
        success: false,
        message: 'Dados e hash são obrigatórios'
      });
    }

    const newHash = crypto.createHash(algorithm);
    newHash.update(JSON.stringify(data));
    const calculatedHash = newHash.digest('hex');

    const isValid = calculatedHash === hash;

    logger.info(`Verificação de integridade: ${isValid ? 'válida' : 'inválida'}`);

    res.json({
      success: true,
      message: 'Verificação de integridade concluída',
      data: {
        isValid,
        originalHash: hash,
        calculatedHash,
        algorithm,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Erro ao verificar integridade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar integridade'
    });
  }
});

// Assinar dados digitalmente
router.post('/sign', requireAuth, async (req, res) => {
  try {
    const { data, privateKey } = req.body;

    if (!data || !privateKey) {
      return res.status(400).json({
        success: false,
        message: 'Dados e chave privada são obrigatórios'
      });
    }

    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(data));
    sign.end();

    const signature = sign.sign(privateKey, 'base64');

    logger.info('Dados assinados digitalmente com sucesso');

    res.json({
      success: true,
      message: 'Dados assinados com sucesso',
      data: {
        signature,
        algorithm: 'SHA256',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Erro ao assinar dados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao assinar dados'
    });
  }
});

// Verificar assinatura digital
router.post('/verify-signature', requireAuth, async (req, res) => {
  try {
    const { data, signature, publicKey } = req.body;

    if (!data || !signature || !publicKey) {
      return res.status(400).json({
        success: false,
        message: 'Dados, assinatura e chave pública são obrigatórios'
      });
    }

    const verify = crypto.createVerify('SHA256');
    verify.update(JSON.stringify(data));
    verify.end();

    const isValid = verify.verify(publicKey, signature, 'base64');

    logger.info(`Verificação de assinatura: ${isValid ? 'válida' : 'inválida'}`);

    res.json({
      success: true,
      message: 'Verificação de assinatura concluída',
      data: {
        isValid,
        algorithm: 'SHA256',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Erro ao verificar assinatura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar assinatura'
    });
  }
});

// Gerar nonce
router.post('/generate-nonce', requireAuth, async (req, res) => {
  try {
    const { length = 32 } = req.body;

    const nonce = crypto.randomBytes(length).toString('hex');

    logger.info('Nonce gerado com sucesso');

    res.json({
      success: true,
      message: 'Nonce gerado com sucesso',
      data: {
        nonce,
        length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Erro ao gerar nonce:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar nonce'
    });
  }
});

// Status das rotas criptografadas
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Rotas criptografadas ativas',
    data: {
      status: 'online',
      algorithms: ['aes-256-gcm', 'sha256', 'rsa'],
      endpoints: [
        'POST /crypto/generate-keys',
        'POST /crypto/encrypt',
        'POST /crypto/decrypt',
        'POST /crypto/hash',
        'POST /crypto/verify-integrity',
        'POST /crypto/sign',
        'POST /crypto/verify-signature',
        'POST /crypto/generate-nonce'
      ],
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
