import express from 'express';
import { body, validationResult } from 'express-validator';
import addressValidationService from '../services/addressValidationService.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @swagger
 * /api/address/validate:
 *   post:
 *     summary: Validar endereço internacional
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
 *                 description: Código do país (BR, CN, US, etc.)
 *               zipCode:
 *                 type: string
 *                 description: CEP/Código postal
 *               address:
 *                 type: string
 *                 description: Endereço completo
 *               city:
 *                 type: string
 *                 description: Cidade
 *               state:
 *                 type: string
 *                 description: Estado/Província
 *               province:
 *                 type: string
 *                 description: Província (para China)
 *     responses:
 *       200:
 *         description: Resultado da validação
 *       400:
 *         description: Dados inválidos
 */
router.post(
  '/validate',
  [
    body('country').notEmpty().withMessage('País é obrigatório'),
    body('zipCode').optional().isLength({ min: 5, max: 10 }).withMessage('CEP inválido'),
    body('address').optional().isLength({ min: 5 }).withMessage('Endereço muito curto'),
    body('city').optional().isLength({ min: 2 }).withMessage('Cidade inválida'),
    body('state').optional().isLength({ min: 2 }).withMessage('Estado inválido')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
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

      logger.info(`Validação de endereço realizada para país: ${country}`);

      res.status(200).json({
        success: true,
        data: validationResult
      });
    } catch (error) {
      logger.error('Erro na validação de endereço:', error);
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
 *     summary: Listar países suportados
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: Lista de países suportados
 */
router.get('/countries', async (req, res) => {
  try {
    const countries = addressValidationService.getSupportedCountries();

    res.status(200).json({
      success: true,
      data: {
        countries
      }
    });
  } catch (error) {
    logger.error('Erro ao listar países:', error);
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
 *     summary: Obter formato de endereço por país
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *           description: Código do país
 *     responses:
 *       200:
 *         description: Formato de endereço
 *       404:
 *         description: País não suportado
 */
router.get('/format/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const format = addressValidationService.getAddressFormat(country.toUpperCase());

    if (!format) {
      return res.status(404).json({
        success: false,
        message: 'País não suportado'
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
    logger.error('Erro ao obter formato de endereço:', error);
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
 *     summary: Formatar endereço para exibição
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
 *         description: Endereço formatado
 *       400:
 *         description: Dados inválidos
 */
router.post('/format', async (req, res) => {
  try {
    const { addressData } = req.body;

    if (!addressData) {
      return res.status(400).json({
        success: false,
        message: 'Dados do endereço são obrigatórios'
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
    logger.error('Erro ao formatar endereço:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
