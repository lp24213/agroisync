import { createRouter } from 'next-connect';
import { connectDB } from '../../../lib/mongodb';
import { verifyToken } from '../../../utils/auth';

const router = createRouter();

// Get KYC status for user
router.get(async (req, res) => {
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

    // Connect to database
    await connectDB();
    const { KYC } = await import('../../../models/KYC');
    const { User } = await import('../../../models/User');

    // Get user KYC documents
    const kycDocuments = await KYC.find({ userId: decoded.userId })
      .sort({ uploadedAt: -1 })
      .select('-buffer'); // Exclude file buffer from response

    // Get user info
    const user = await User.findById(decoded.userId).select(
      'kycStatus kycDocuments role'
    );

    // Calculate overall KYC status
    const overallStatus = calculateOverallStatus(kycDocuments, user.role);

    res.status(200).json({
      success: true,
      kycStatus: overallStatus,
      documents: kycDocuments,
      user: {
        kycStatus: user.kycStatus,
        role: user.role,
      },
      requirements: getKYCRequirements(user.role),
      progress: calculateProgress(kycDocuments, user.role),
    });
  } catch (error) {
    console.error('KYC Status Error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Update KYC status (admin only)
router.put(async (req, res) => {
  try {
    // Verify admin authentication
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token de acesso necessário' });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { documentId, status, reason, notes } = req.body;

    if (!documentId || !status) {
      return res
        .status(400)
        .json({ error: 'ID do documento e status são obrigatórios' });
    }

    // Connect to database
    await connectDB();
    const { KYC } = await import('../../../models/KYC');
    const { User } = await import('../../../models/User');

    // Update document status
    const updatedDocument = await KYC.findByIdAndUpdate(
      documentId,
      {
        status,
        reviewedBy: decoded.userId,
        reviewedAt: new Date(),
        reason,
        notes,
      },
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }

    // Update user KYC status
    const user = await User.findById(updatedDocument.userId);
    const userDocuments = await KYC.find({ userId: user._id });
    const newUserStatus = calculateOverallStatus(userDocuments, user.role);

    await User.findByIdAndUpdate(user._id, {
      kycStatus: newUserStatus,
    });

    // Send notification to user
    await sendKYCNotification(user._id, status, reason);

    res.status(200).json({
      success: true,
      document: updatedDocument,
      userStatus: newUserStatus,
    });
  } catch (error) {
    console.error('KYC Status Update Error:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Helper functions
function calculateOverallStatus(documents, role) {
  const requirements = getKYCRequirements(role);
  const documentTypes = documents.map(doc => doc.documentType);

  // Check if all required documents are present and approved
  const hasAllRequired = requirements.every(
    req =>
      documentTypes.includes(req.type) &&
      documents.find(doc => doc.documentType === req.type)?.status ===
        'approved'
  );

  if (hasAllRequired) return 'approved';

  // Check if any document is rejected
  const hasRejected = documents.some(doc => doc.status === 'rejected');
  if (hasRejected) return 'rejected';

  // Check if any document is pending
  const hasPending = documents.some(doc => doc.status === 'pending_review');
  if (hasPending) return 'pending_review';

  return 'incomplete';
}

function getKYCRequirements(role) {
  const baseRequirements = [
    { type: 'id', name: 'Documento de Identidade', required: true },
    { type: 'address', name: 'Comprovante de Endereço', required: true },
  ];

  const roleRequirements = {
    driver: [
      { type: 'license', name: 'Carteira de Habilitação', required: true },
      { type: 'vehicle', name: 'Documento do Veículo', required: true },
    ],
    seller: [
      { type: 'business', name: 'Documento da Empresa', required: true },
    ],
    buyer: [],
  };

  return [...baseRequirements, ...(roleRequirements[role] || [])];
}

function calculateProgress(documents, role) {
  const requirements = getKYCRequirements(role);
  const totalRequired = requirements.filter(req => req.required).length;
  const completed = documents.filter(doc => doc.status === 'approved').length;

  return {
    completed,
    total: totalRequired,
    percentage: Math.round((completed / totalRequired) * 100),
  };
}

async function sendKYCNotification(userId, status, reason) {
  try {
    const { User } = await import('../../../models/User');
    const { Notification } = await import('../../../models/Notification');

    const user = await User.findById(userId);
    if (!user) return;

    const notification = new Notification({
      userId,
      type: 'kyc_status_update',
      title: status === 'approved' ? 'KYC Aprovado' : 'KYC Rejeitado',
      message:
        status === 'approved'
          ? 'Seus documentos foram aprovados! Você pode agora usar todas as funcionalidades da plataforma.'
          : `Seus documentos foram rejeitados. Motivo: ${reason || 'Não especificado'}`,
      data: {
        status,
        reason,
      },
      read: false,
    });

    await notification.save();

    // Send email notification
    const { sendEmail } = await import('../../../utils/email');
    await sendEmail({
      to: user.email,
      template: 'kyc_status_update',
      data: {
        name: user.name,
        status,
        reason,
      },
    });
  } catch (error) {
    console.error('KYC Notification Error:', error);
  }
}

export default router.handler({
  onError: (err, req, res) => {
    console.error('KYC Status Handler Error:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  },
});
