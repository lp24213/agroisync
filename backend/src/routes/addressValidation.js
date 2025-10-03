import express from 'express';
import { body, validationResult } from 'express-validator';
import addressValidationService from '../services/addressValidationService.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @swagger
 * /api/address/validate:
 *   post:
 *     summary: Validar endereÃ§o internacional
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country
 *             properties:
 *               country:
 *                 type: string
 *                 description: CÃ³digo do paÃ­s (BR, CN, US, etc.)
 *               zipCode:
 *                 type: string
 *                 description: CEP/CÃ³digo postal
 *               address:
 *                 type: string
 *                 description: EndereÃ§o completo
 *               city:
 *                 type: string
 *                 description: Cidade
 *               state:
 *                 type: string
 *                 description: Estado/ProvÃ­ncia
 *               province:
 *                 type: string
 *                 description: ProvÃ­ncia (para China)
 *     responses:
 *       200:
 *         description: Resultado da validaÃ§Ã£o
 *       400:
 *         description: Dados invÃ¡lidos
 */
router.post(
  '/validate',
  [
    body('country').notEmpty().withMessage('PaÃ­s Ã© obrigatÃ³rio'),
    body('zipCode').optional().isLength({ min: 5, max: 10 }).withMessage('CEP invÃ¡lido'),
    body('address').optional().isLength({ min: 5 }).withMessage('EndereÃ§o muito curto'),
    body('city').optional().isLength({ min: 2 }).withMessage('Cidade invÃ¡lida'),
    body('state').optional().isLength({ min: 2 }).withMessage('Estado invÃ¡lido')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados invÃ¡lidos',
          errors: errors.array()
        });
      }

      const { country, zipCode, address, city, state, province } = req.body;

      const validationResult = await addressValidationService.validateAddress({
        country,
        zipCode,
        address,
        city,
        state,
        province
      });

      logger.info(`ValidaÃ§Ã£o de endereÃ§o realizada para paÃ­s: ${country}`);

      res.status(200).json({
        success: true,
        data: validationResult
      });
    } catch (error) {
      logger.error('Erro na validaÃ§Ã£o de endereÃ§o:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

/**
 * @swagger
 * /api/address/countries:
 *   get:
 *     summary: Listar paÃ­ses suportados
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: Lista de paÃ­ses suportados
 */
router.get('/countries', (req, res) => {
  try {
    const countries = addressValidationService.getSupportedCountries();

    res.status(200).json({
      success: true,
      data: {
        countries
      }
    });
  } catch (error) {
    logger.error('Erro ao listar paÃ­ses:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/address/format/{country}:
 *   get:
 *     summary: Obter formato de endereÃ§o por paÃ­s
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *           description: CÃ³digo do paÃ­s
 *     responses:
 *       200:
 *         description: Formato de endereÃ§o
 *       404:
 *         description: PaÃ­s nÃ£o suportado
 */
router.get('/format/:country', (req, res) => {
  try {
    const { country } = req.params;
    const format = addressValidationService.getAddressFormat(country.toUpperCase());

    if (!format) {
      return res.status(404).json({
        success: false,
        message: 'PaÃ­s nÃ£o suportado'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        country: country.toUpperCase(),
        format
      }
    });
  } catch (error) {
    logger.error('Erro ao obter formato de endereÃ§o:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/address/format:
 *   post:
 *     summary: Formatar endereÃ§o para exibiÃ§Ã£o
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressData
 *             properties:
 *               addressData:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       200:
 *         description: EndereÃ§o formatado
 *       400:
 *         description: Dados invÃ¡lidos
 */
router.post('/format', (req, res) => {
  try {
    const { addressData } = req.body;

    if (!addressData) {
      return res.status(400).json({
        success: false,
        message: 'Dados do endereÃ§o sÃ£o obrigatÃ³rios'
      });
    }

    const formattedAddress = addressValidationService.formatAddress(addressData);

    res.status(200).json({
      success: true,
      data: {
        formattedAddress
      }
    });
  } catch (error) {
    logger.error('Erro ao formatar endereÃ§o:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
