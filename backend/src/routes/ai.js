const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Reconhecimento de imagem (stub)
router.post('/recognize', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Imagem não enviada' });

    // Placeholder simples: tenta inferir pelo nome do arquivo
    const name = (req.file.originalname || '').toLowerCase();
    let label = null;
    if (name.includes('soja')) label = 'Saco de Soja';
    if (name.includes('milho')) label = 'Saco de Milho';
    if (name.includes('adubo')) label = 'Adubo';

    return res.json({ label, confidence: label ? 0.62 : 0.0 });
  } catch (e) {
    return res.status(500).json({ error: 'Falha ao processar imagem' });
  }
});

module.exports = router;


