import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'
import { WithId, Document } from 'mongodb'

type Translation = {
  _id?: string
  key: string
  pt: string
  en: string
  es: string
  zh: string
  category: string
  description?: string
  updatedAt: Date
}

type TranslationResponse = {
  success: boolean
  message: string
  data?: {
    translations: Record<string, Record<string, string>>
    categories: string[]
    lastUpdate: Date
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync'
const DB_NAME = 'agroisync'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TranslationResponse>
) {
  if (req.method === 'GET') {
    try {
      const client = await MongoClient.connect(MONGODB_URI)
      const db = client.db(DB_NAME)

      const { locale = 'pt', category } = req.query

      // Buscar traduções
      const translationsCollection = db.collection('translations')
      const filter: any = {}
      
      if (category && category !== 'all') {
        filter.category = category
      }

      const translations = await translationsCollection
        .find(filter)
        .sort({ category: 1, key: 1 })
        .toArray()

      // Organizar traduções por categoria e idioma
      const result: Record<string, string> = {}
      const categories: string[] = []

      translations.forEach((translation: WithId<Document>) => {
        const trans = translation as any
        if (trans.key && trans[locale as string]) {
          result[trans.key] = trans[locale as string]
        }
      })

      // Buscar última atualização
      const lastUpdate = await translationsCollection
        .findOne({}, { sort: { updatedAt: -1 } })

      await client.close()

      return res.status(200).json({
        success: true,
        message: 'Traduções carregadas com sucesso',
        data: {
          translations: { [locale as string]: result },
          categories,
          lastUpdate: lastUpdate?.updatedAt || new Date()
        }
      })

    } catch (error: any) {
      console.error('Erro na API de traduções:', error)
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const client = await MongoClient.connect(MONGODB_URI)
      const db = client.db(DB_NAME)

      const { key, pt, en, es, zh, category, description } = req.body

      if (!key || !pt || !en || !es || !zh || !category) {
        return res.status(400).json({
          success: false,
          message: 'Dados obrigatórios não fornecidos'
        })
      }

      // Verificar se a tradução já existe
      const translationsCollection = db.collection('translations')
      const existingTranslation = await translationsCollection.findOne({ key })

      if (existingTranslation) {
        // Atualizar tradução existente
        await translationsCollection.updateOne(
          { key },
          {
            $set: {
              pt,
              en,
              es,
              zh,
              category,
              description,
              updatedAt: new Date()
            }
          }
        )
      } else {
        // Criar nova tradução
        await translationsCollection.insertOne({
          key,
          pt,
          en,
          es,
          zh,
          category,
          description,
          updatedAt: new Date()
        })
      }

      await client.close()

      return res.status(200).json({
        success: true,
        message: existingTranslation ? 'Tradução atualizada com sucesso' : 'Tradução criada com sucesso'
      })

    } catch (error: any) {
      console.error('Erro ao salvar tradução:', error)
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
