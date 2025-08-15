import type { NextApiRequest, NextApiResponse } from 'next'

type ContactResponse = {
  success: boolean
  message: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContactResponse>
) {
  if (req.method === 'POST') {
    // Enviar mensagem de contato
    const { name, email, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      })
    }

    // Simular envio de email (será integrado com serviço real)
    const contactData = {
      id: 'contact-123',
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }

    return res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      data: contactData
    })
  }

  if (req.method === 'GET') {
    // Obter mensagens de contato (apenas para admin)
    return res.status(200).json({
      success: true,
      message: 'Mensagens de contato obtidas com sucesso',
      data: {
        messages: [
          {
            id: 'contact-1',
            name: 'João Silva',
            email: 'joao@email.com',
            subject: 'Dúvida sobre Staking',
            message: 'Como funciona o sistema de staking?',
            timestamp: '2024-01-15T08:00:00Z',
            status: 'pending'
          }
        ]
      }
    })
  }

  return res.status(405).json({
    success: false,
    message: 'Método não permitido'
  })
}
