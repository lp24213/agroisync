import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ObjectId, Document } from 'mongodb'
import formidable, { File, Fields } from 'formidable'
import fs from 'fs'
import path from 'path'

type UploadedFile = {
  _id?: ObjectId
  userId: string
  originalName: string
  filename: string
  path: string
  size: number
  mimetype: string
  category: string
  metadata?: {
    width?: number
    height?: number
    duration?: number
    tags?: string[]
  }
  createdAt: Date
}

type UploadResponse = {
  success: boolean
  message: string
  data?: {
    fileId?: string
    filename?: string
    url?: string
    size?: number
    files?: any[]
    total?: number
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync'
const DB_NAME = 'agroisync'
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Configurar formidable
export const config = {
  api: {
    bodyParser: false,
  },
}

// Garantir que o diretório de upload existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  if (req.method === 'POST') {
    try {
      const form = formidable({
        uploadDir: UPLOAD_DIR,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        filter: ({ mimetype }: { mimetype?: string }) => {
          // Permitir apenas imagens, vídeos e documentos
          return Boolean(mimetype && (
            mimetype.includes('image/') ||
            mimetype.includes('video/') ||
            mimetype.includes('application/pdf') ||
            mimetype.includes('application/msword') ||
            mimetype.includes('application/vnd.openxmlformats-officedocument')
          ))
        }
      })

      const [fields, files] = await form.parse(req)
      
      const userId = fields.userId?.[0]
      const category = fields.category?.[0] || 'general'
      const tags = fields.tags?.[0] ? JSON.parse(fields.tags[0]) : []

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário é obrigatório'
        })
      }

      if (!files.file || files.file.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum arquivo foi enviado'
        })
      }

      const file = files.file[0]
      
      // Gerar nome único para o arquivo
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = path.extname(file.originalFilename || '')
      const filename = `${timestamp}_${randomString}${extension}`
      const filepath = path.join(UPLOAD_DIR, filename)

      // Renomear arquivo
      fs.renameSync(file.filepath, filepath)

      // Conectar ao MongoDB
      const client = await MongoClient.connect(MONGODB_URI)
      const db = client.db(DB_NAME)

      // Salvar informações do arquivo
      const uploadedFile: Omit<UploadedFile, '_id'> = {
        userId,
        originalName: file.originalFilename || '',
        filename,
        path: filepath,
        size: file.size || 0,
        mimetype: file.mimetype || '',
        category,
        metadata: {
          tags
        },
        createdAt: new Date()
      }

      const filesCollection = db.collection<UploadedFile>('uploaded_files')
      const result = await filesCollection.insertOne(uploadedFile)

      await client.close()

      // Retornar URL pública do arquivo
      const publicUrl = `/uploads/${filename}`

      return res.status(200).json({
        success: true,
        message: 'Arquivo enviado com sucesso',
        data: {
          fileId: result.insertedId.toString(),
          filename,
          url: publicUrl,
          size: file.size || 0
        }
      })

    } catch (error: any) {
      console.error('Erro no upload:', error)
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }

  if (req.method === 'GET') {
    try {
      const client = await MongoClient.connect(MONGODB_URI)
      const db = client.db(DB_NAME)

      const filesCollection = db.collection<UploadedFile>('uploaded_files')
      const files = await filesCollection.find({}).toArray()

      await client.close()

      return res.status(200).json({
        success: true,
        message: 'Arquivos listados com sucesso',
        data: {
          files,
          total: files.length
        }
      })

    } catch (error: any) {
      console.error('Erro ao listar arquivos:', error)
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }

  return res.status(405).json({
    success: false,
    message: 'Método não permitido'
  })
}
