import type { NextApiRequest, NextApiResponse } from 'next'

type UploadResponse = {
  success: boolean
  message: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  if (req.method === 'POST') {
    try {
      const { filename, fileType, fileSize, category } = req.body

      if (!filename || !fileType || !fileSize) {
        return res.status(400).json({
          success: false,
          message: 'Parâmetros de arquivo inválidos'
        })
      }

      // Simular resultado do upload para build
      const result = {
        id: `upload-${Date.now()}`,
        filename,
        fileType,
        fileSize,
        category: category || 'general',
        url: `https://storage.agroisync.com/uploads/${filename}`,
        timestamp: new Date().toISOString(),
        status: 'completed'
      }
      
      return res.status(200).json({
        success: true,
        message: 'Arquivo enviado com sucesso',
        data: result
      })
    } catch (error: any) {
      console.error('Erro na API de upload:', error)
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }

  if (req.method === 'GET') {
    try {
      // Retornar lista de arquivos simulada
      const result = {
        files: [
          {
            id: 'file-1',
            filename: 'farm-document.pdf',
            fileType: 'application/pdf',
            fileSize: '2.5 MB',
            category: 'documents',
            url: 'https://storage.agroisync.com/uploads/farm-document.pdf',
            timestamp: '2024-01-15T10:00:00Z'
          },
          {
            id: 'file-2',
            filename: 'farm-image.jpg',
            fileType: 'image/jpeg',
            fileSize: '1.2 MB',
            category: 'images',
            url: 'https://storage.agroisync.com/uploads/farm-image.jpg',
            timestamp: '2024-01-15T09:30:00Z'
          }
        ]
      }
      
      return res.status(200).json({
        success: true,
        message: 'Arquivos listados com sucesso',
        data: result
      })
    } catch (error: any) {
      console.error('Erro ao listar arquivos:', error)
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar arquivos'
      })
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Método não permitido'
  })
}
