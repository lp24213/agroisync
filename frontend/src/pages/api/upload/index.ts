import type { NextApiRequest, NextApiResponse } from 'next'
import { uploadService } from '@/services/api'

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

      // Usar serviço real de upload
      try {
        // Simular arquivo para o serviço
        const mockFile = new File([''], filename, { type: fileType })
        
        const result = await uploadService.uploadFile(mockFile, category)
        
        return res.status(200).json({
          success: true,
          message: 'Arquivo enviado com sucesso',
          data: result
        })
      } catch (error: any) {
        console.error('Erro no upload:', error)
        return res.status(400).json({
          success: false,
          message: error.response?.data?.message || 'Erro no upload do arquivo'
        })
      }
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
      // Usar serviço real para listar arquivos
      const result = await uploadService.getFiles()
      
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
