import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Criar diretório de uploads se não existir
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Filtro de tipos de arquivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use JPEG, PNG, GIF, WEBP ou PDF.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

// ===== ROTAS =====

// Health check
router.get('/', (_req, res) => {
  res.json({
    message: 'Upload service',
    status: 'operational',
    cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME
  });
});

// Upload single file
router.post('/single', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo enviado'
      });
    }

    // Se Cloudinary estiver configurado, fazer upload para lá também
    let cloudinaryUrl = null;
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const cloudinary = require('cloudinary').v2;
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'agroisync',
          resource_type: 'auto'
        });

        cloudinaryUrl = result.secure_url;
      } catch (cloudinaryError) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Erro ao fazer upload para Cloudinary:', cloudinaryError);
        }
        // Continuar mesmo se Cloudinary falhar
      }
    }

    // Retornar URL local (sempre) e Cloudinary (se disponível)
    const localUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        localUrl: localUrl,
        cloudinaryUrl: cloudinaryUrl,
        url: cloudinaryUrl || localUrl // Priorizar Cloudinary se disponível
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro no upload:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer upload do arquivo',
      error: error.message
    });
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo enviado'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`
    }));

    res.json({
      success: true,
      message: `${req.files.length} arquivo(s) enviado(s) com sucesso`,
      data: uploadedFiles
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro no upload múltiplo:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer upload dos arquivos',
      error: error.message
    });
  }
});

// Deletar arquivo
router.delete('/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Arquivo não encontrado'
      });
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Arquivo deletado com sucesso'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao deletar arquivo:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar arquivo',
      error: error.message
    });
  }
});

// Servir arquivos estáticos
router.use('/files', express.static(uploadsDir));

export default router;
