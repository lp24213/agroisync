const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const logger = require('../utils/logger');

// @route   POST /api/contact
// @desc    Send contact message
// @access  Public
router.post('/', [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('message', 'Message is required').notEmpty().isLength({ min: 10 })
], (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, message, subject, phone } = req.body;

    // In a real application, you would send an email here
    // For now, we'll just log the contact message
    logger.info('Contact message received', {
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      phone: phone || 'Not provided',
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully',
      data: {
        name,
        email,
        subject: subject || 'General Inquiry',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Send contact message error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/contact/info
// @desc    Get contact information
// @access  Public
router.get('/info', (req, res) => {
  try {
    const contactInfo = {
      email: 'contato@agroisync.com',
      phone: '+55 (66) 99236-2830',
      whatsapp: '+55 (66) 99236-2830',
      address: 'Mato Grosso, Brazil',
      businessHours: 'Seg-Sex 9h-18h',
      socialMedia: {
        twitter: 'https://twitter.com/agrotm',
        telegram: 'https://t.me/agrotm',
        discord: 'https://discord.gg/agrotm',
        linkedin: 'https://linkedin.com/company/agrotm'
      },
      support: {
        email: 'suporte@agroisync.com',
        phone: '+55 (66) 99236-2830',
        whatsapp: '+55 (66) 99236-2830'
      }
    };

    logger.info('Contact information requested');

    res.json({
      success: true,
      data: contactInfo
    });
  } catch (error) {
    logger.error('Get contact info error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/contact/support
// @desc    Send support request
// @access  Public
router.post('/support', [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('subject', 'Subject is required').notEmpty(),
  body('message', 'Message is required').notEmpty().isLength({ min: 10 }),
  body('priority', 'Priority must be low, medium, or high').isIn(['low', 'medium', 'high'])
], (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, subject, message, priority, category } = req.body;

    // In a real application, you would create a support ticket here
    logger.info('Support request received', {
      name,
      email,
      subject,
      message,
      priority,
      category: category || 'General',
      timestamp: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Support request submitted successfully',
      ticketId: `TICKET-${Date.now()}`,
      data: {
        name,
        email,
        subject,
        priority,
        category: category || 'General',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Send support request error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
