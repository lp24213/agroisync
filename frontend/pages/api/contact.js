// API endpoint para formulário de contato
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validação básica
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Simular envio de email (em produção, usar serviço real)
    const contactEmail = process.env.CONTACT_EMAIL || 'contato@agroisync.com';
    
    // Log da mensagem (em produção, enviar para serviço de email)
    console.log('Nova mensagem de contato:', {
      from: email,
      name,
      subject: subject || 'Contato via site',
      message,
      to: contactEmail,
      timestamp: new Date().toISOString()
    });

    // Resposta de sucesso
    return res.status(200).json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' 
    });

  } catch (error) {
    console.error('Erro no endpoint de contato:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor. Tente novamente mais tarde.' 
    });
  }
}
