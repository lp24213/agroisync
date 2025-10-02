import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Gera um token JWT de acesso
 */
export const generateAccessToken = payload => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'agroisync',
    audience: 'agroisync-users'
  });
};

/**
 * Gera um token JWT de refresh
 */
export const generateRefreshToken = payload => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'agroisync',
    audience: 'agroisync-refresh'
  });
};

/**
 * Gera um token de refresh único e seguro
 */
export const generateSecureRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Verifica e decodifica um token de acesso
 */
export const verifyAccessToken = token => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'agroisync',
      audience: 'agroisync-users'
    });
  } catch (error) {
    throw new Error(`Token de acesso inválido: ${error.message}`);
  }
};

/**
 * Verifica e decodifica um token de refresh
 */
export const verifyRefreshToken = token => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'agroisync',
      audience: 'agroisync-refresh'
    });
  } catch (error) {
    throw new Error(`Token de refresh inválido: ${error.message}`);
  }
};

/**
 * Cria um novo par de tokens (acesso + refresh)
 */
export const createTokenPair = async user => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    isPaid: user.isPaid
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const secureRefreshToken = generateSecureRefreshToken();

  // Salvar refresh token no banco
  await RefreshToken.create({
    userId: user._id,
    token: secureRefreshToken,
    jwtToken: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
    userAgent: null, // Será preenchido pelo middleware
    ipAddress: null, // Será preenchido pelo middleware
    isActive: true
  });

  return {
    accessToken,
    refreshToken: secureRefreshToken,
    expiresIn: JWT_EXPIRES_IN
  };
};

/**
 * Renova um token de acesso usando o refresh token
 */
export const refreshAccessToken = async (refreshToken, userAgent, ipAddress) => {
  try {
    // Buscar refresh token no banco
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).populate('userId');

    if (!storedToken) {
      throw new Error('Refresh token inválido ou expirado');
    }

    // Verificar se o usuário ainda está ativo
    if (!storedToken.userId.isActive) {
      await RefreshToken.findByIdAndUpdate(storedToken._id, { isActive: false });
      throw new Error('Usuário inativo');
    }

    // Verificar o JWT token
    verifyRefreshToken(storedToken.jwtToken);

    // Gerar novo token de acesso
    const payload = {
      userId: storedToken.userId._id,
      email: storedToken.userId.email,
      role: storedToken.userId.role,
      isPaid: storedToken.userId.isPaid
    };

    const newAccessToken = generateAccessToken(payload);

    // Atualizar informações do refresh token
    storedToken.lastUsedAt = new Date();
    storedToken.userAgent = userAgent;
    storedToken.ipAddress = ipAddress;
    await storedToken.save();

    return {
      accessToken: newAccessToken,
      expiresIn: JWT_EXPIRES_IN
    };
  } catch (error) {
    throw new Error(`Erro ao renovar token: ${error.message}`);
  }
};

/**
 * Revoga um refresh token
 */
export const revokeRefreshToken = async refreshToken => {
  try {
    await RefreshToken.findOneAndUpdate(
      { token: refreshToken },
      { isActive: false, revokedAt: new Date() }
    );
  } catch (error) {
    throw new Error(`Erro ao revogar token: ${error.message}`);
  }
};

/**
 * Revoga todos os refresh tokens de um usuário
 */
export const revokeAllUserTokens = async userId => {
  try {
    await RefreshToken.updateMany(
      { userId, isActive: true },
      { isActive: false, revokedAt: new Date() }
    );
  } catch (error) {
    throw new Error(`Erro ao revogar tokens do usuário: ${error.message}`);
  }
};

/**
 * Limpa refresh tokens expirados
 */
export const cleanupExpiredTokens = async () => {
  const result = await RefreshToken.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isActive: false, revokedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } // Remove tokens revogados há mais de 30 dias
    ]
  });

  // Console log removido (dados sensíveis)
  return result.deletedCount;
};

/**
 * Obtém informações de um token
 */
export const getTokenInfo = async refreshToken => {
  try {
    const token = await RefreshToken.findOne({
      token: refreshToken,
      isActive: true
    }).populate('userId', 'email role isActive');

    if (!token) {
      return null;
    }

    return {
      userId: token.userId._id,
      email: token.userId.email,
      role: token.userId.role,
      isActive: token.userId.isActive,
      createdAt: token.createdAt,
      lastUsedAt: token.lastUsedAt,
      expiresAt: token.expiresAt,
      userAgent: token.userAgent,
      ipAddress: token.ipAddress
    };
  } catch (error) {
    throw new Error(`Erro ao obter informações do token: ${error.message}`);
  }
};

/**
 * Middleware para verificar refresh token
 */
export const authenticateRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token não fornecido'
      });
    }

    const tokenInfo = await getTokenInfo(refreshToken);
    if (!tokenInfo) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido ou expirado'
      });
    }

    if (!tokenInfo.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Usuário inativo'
      });
    }

    req.tokenInfo = tokenInfo;
    req.refreshToken = refreshToken;
    return next();
  } catch {
    // Console log removido (dados sensíveis)
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};
