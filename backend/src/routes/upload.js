const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const logger = require('../utils/logger');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    await fs.ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Max 5 files
  }
});

// @route   POST /api/upload/image
// @desc    Upload image
// @access  Private
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const { width, height, quality } = req.body;
    const originalPath = req.file.path;
    const filename = req.file.filename;

    // Process image if dimensions or quality are specified
    if (width || height || quality) {
      try {
        let sharpInstance = sharp(originalPath);

        if (width || height) {
          sharpInstance = sharpInstance.resize(
            width ? parseInt(width) : undefined,
            height ? parseInt(height) : undefined,
            { fit: 'inside', withoutEnlargement: true }
          );
        }

        if (quality) {
          sharpInstance = sharpInstance.jpeg({ quality: parseInt(quality) });
        }

        const processedPath = path.join(path.dirname(originalPath), `processed_${filename}`);
        await sharpInstance.toFile(processedPath);

        // Replace original with processed
        await fs.remove(originalPath);
        await fs.move(processedPath, originalPath);
      } catch (error) {
        logger.error('Image processing error:', error);
        // Continue with original file if processing fails
      }
    }

    const fileUrl = `/uploads/${filename}`;

    logger.info(`Image uploaded by user ${req.user.id}: ${filename}`);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl
      }
    });
  } catch (error) {
    logger.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/upload/images
// @desc    Upload multiple images
// @access  Private
router.post('/images', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No image files provided'
      });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fileUrl = `/uploads/${file.filename}`;
      uploadedFiles.push({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl
      });
    }

    logger.info(`Multiple images uploaded by user ${req.user.id}: ${uploadedFiles.length} files`);

    res.status(201).json({
      success: true,
      message: `${uploadedFiles.length} images uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    logger.error('Upload multiple images error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   POST /api/upload/document
// @desc    Upload document
// @access  Private
router.post('/document', (req, res) => {
  try {
    // Document upload functionality would be implemented here
    // For now, return a mock response
    logger.info(`Document upload requested by user ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Document upload endpoint - implementation pending',
      data: {
        filename: 'document.pdf',
        size: 1024,
        url: '/uploads/document.pdf'
      }
    });
  } catch (error) {
    logger.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   DELETE /api/upload/:filename
// @desc    Delete uploaded file
// @access  Private
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', filename);

    // Check if file exists
    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Delete file
    await fs.remove(filePath);

    logger.info(`File deleted by user ${req.user.id}: ${filename}`);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    logger.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @route   GET /api/upload/files
// @desc    Get user's uploaded files
// @access  Private
router.get('/files', async (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    if (!await fs.pathExists(uploadDir)) {
      return res.json({
        success: true,
        data: []
      });
    }

    const files = await fs.readdir(uploadDir);
    const fileList = [];

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stats = await fs.stat(filePath);
      
      fileList.push({
        filename: file,
        size: stats.size,
        url: `/uploads/${file}`,
        uploadedAt: stats.birthtime
      });
    }

    logger.info(`File list requested by user ${req.user.id}`);

    res.json({
      success: true,
      data: fileList
    });
  } catch (error) {
    logger.error('Get files error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;
