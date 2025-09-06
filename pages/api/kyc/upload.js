import multer from 'multer';
import { createRouter } from 'next-connect';
import { connectDB } from '../../../lib/mongodb';
import { verifyToken } from '../../../utils/auth';
// import { createReadStream } from 'fs'; // Not used in current implementation
import Tesseract from 'tesseract.js';
import sharp from 'sharp';

const router = createRouter();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'), false);
    }
  },
});

// Middleware for file upload
router.use(upload.single('document'));

// OCR processing function
async function processOCR(buffer, mimeType) {
  try {
    let imageBuffer = buffer;

    // Convert PDF to image if needed
    if (mimeType === 'application/pdf') {
      // For PDF, we'd need pdf2pic or similar library
      // For now, return mock data
      return {
        text: 'Mock OCR text from PDF',
        confidence: 0.85,
      };
    }

    // Optimize image for OCR
    if (mimeType.startsWith('image/')) {
      imageBuffer = await sharp(buffer)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .sharpen()
        .normalize()
        .jpeg({ quality: 90 })
        .toBuffer();
    }

    // Perform OCR
    const {
      data: { text, confidence },
    } = await Tesseract.recognize(
      imageBuffer,
      'por+eng', // Portuguese and English
      {
        logger: m => console.log(m),
      }
    );

    return {
      text: text.trim(),
      confidence: confidence / 100,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    return {
      text: '',
      confidence: 0,
    };
  }
}

// Document validation function
function validateDocument(ocrText, documentType) {
  const validations = {
    id: {
      patterns: [
        /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/, // CPF
        /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/, // CNPJ
        /RG\s*\d+/i, // RG
        /IDENTIDADE\s*\d+/i,
      ],
      required: ['CPF', 'RG', 'IDENTIDADE'],
    },
    address: {
      patterns: [
        /CEP\s*\d{5}-?\d{3}/i,
        /RUA\s+[A-Z\s]+/i,
        /AVENIDA\s+[A-Z\s]+/i,
        /CONTA\s+DE\s+LUZ/i,
        /CONTA\s+DE\s+AGUA/i,
        /FATURA\s+DE\s+ENERGIA/i,
      ],
      required: ['CEP', 'RUA', 'ENDERECO'],
    },
    license: {
      patterns: [
        /CNH\s*\d+/i,
        /CARTEIRA\s+DE\s+HABILITACAO/i,
        /CATEGORIA\s+[A-Z]/i,
        /VALIDADE/i,
      ],
      required: ['CNH', 'CATEGORIA'],
    },
  };

  const validation = validations[documentType];
  if (!validation) return { isValid: false, score: 0 };

  let score = 0;
  const foundPatterns = [];

  validation.patterns.forEach(pattern => {
    if (pattern.test(ocrText)) {
      score += 1;
      foundPatterns.push(pattern.source);
    }
  });

  const isValid = score >= validation.required.length * 0.7; // 70% of required patterns

  return {
    isValid,
    score: score / validation.patterns.length,
    foundPatterns,
    confidence: score / validation.required.length,
  };
}

// Anti-fraud detection
function detectFraud(ocrText, documentType) {
  console.log('Detecting fraud for document type:', documentType); // Use documentType
  const fraudIndicators = [
    /teste/i,
    /mock/i,
    /fake/i,
    /falso/i,
    /copia/i,
    /scan/i,
    /fotocopia/i,
    /reproducao/i,
  ];

  const fraudScore = fraudIndicators.reduce((score, pattern) => {
    return score + (pattern.test(ocrText) ? 1 : 0);
  }, 0);

  return {
    isFraud: fraudScore > 0,
    fraudScore: fraudScore / fraudIndicators.length,
    indicators: fraudIndicators.filter(pattern => pattern.test(ocrText)),
    documentType: documentType, // Use documentType in return
  };
}

router.post(async (req, res) => {
  try {
    // Verify authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token de acesso necessário' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { documentType } = req.body;
    console.log('Processing document type:', documentType); // Use documentType
    if (!documentType) {
      return res.status(400).json({ error: 'Tipo de documento necessário' });
    }

    // Connect to database
    await connectDB();
    const { KYC } = await import('../../../models/KYC');

    // Process OCR
    const ocrResult = await processOCR(req.file.buffer, req.file.mimetype);

    // Validate document
    const validation = validateDocument(ocrResult.text, documentType);

    // Detect fraud
    const fraudDetection = detectFraud(ocrResult.text, documentType);

    // Save document to database
    const kycDocument = new KYC({
      userId: decoded.userId,
      documentType,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer,
      ocrText: ocrResult.text,
      ocrConfidence: ocrResult.confidence,
      validation: {
        isValid: validation.isValid,
        score: validation.score,
        foundPatterns: validation.foundPatterns,
        confidence: validation.confidence,
      },
      fraudDetection: {
        isFraud: fraudDetection.isFraud,
        fraudScore: fraudDetection.fraudScore,
        indicators: fraudDetection.indicators,
      },
      status: fraudDetection.isFraud
        ? 'rejected'
        : validation.isValid
          ? 'approved'
          : 'pending_review',
      uploadedAt: new Date(),
    });

    await kycDocument.save();

    // Update user KYC status
    const { User } = await import('../../../models/User');
    await User.findByIdAndUpdate(decoded.userId, {
      kycStatus: kycDocument.status,
      kycDocuments: [
        ...((await User.findById(decoded.userId)).kycDocuments || []),
        kycDocument._id,
      ],
    });

    res.status(200).json({
      success: true,
      documentId: kycDocument._id,
      status: kycDocument.status,
      validation: {
        isValid: validation.isValid,
        score: validation.score,
        confidence: validation.confidence,
      },
      fraudDetection: {
        isFraud: fraudDetection.isFraud,
        fraudScore: fraudDetection.fraudScore,
      },
      ocr: {
        text: ocrResult.text.substring(0, 200) + '...', // Truncate for response
        confidence: ocrResult.confidence,
      },
    });
  } catch (error) {
    console.error('KYC Upload Error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error('KYC Upload Handler Error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};
