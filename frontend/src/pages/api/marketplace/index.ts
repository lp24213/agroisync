import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ObjectId } from 'mongodb'

type Product = {
  _id?: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating: number
  reviews: number
  owner: string
  location: string
  inStock: boolean
  isFavorite: boolean
  tags: string[]
  stock: number
  seller: {
    id: string
    name: string
    rating: number
    verified: boolean
  }
  badges: string[]
  createdAt: Date
  updatedAt: Date
}

type MarketplaceResponse = {
  success: boolean
  message: string
  data?: Product[]
  total?: number
  page?: number
  limit?: number
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync'
const DB_NAME = 'agroisync'
const COLLECTION_NAME = 'products'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MarketplaceResponse>
) {
  if (req.method === 'GET') {
    try {
      const client = await MongoClient.connect(MONGODB_URI)
      const db = client.db(DB_NAME)
      const collection = db.collection(COLLECTION_NAME)

      // Parâmetros de query
      const { 
        page = 1, 
        limit = 20, 
        category, 
        search, 
        minPrice, 
        maxPrice,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query

      // Construir filtros
      const filters: any = {}
      
      if (category && category !== 'all') {
        filters.category = category
      }
      
      const searchFilter = search ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search.toString(), 'i')] } }
        ]
      } : {}
      
      if (minPrice || maxPrice) {
        filters.price = {}
        if (minPrice) filters.price.$gte = parseFloat(minPrice as string)
        if (maxPrice) filters.price.$lte = parseFloat(maxPrice as string)
      }

      // Construir ordenação
      const sort: any = {}
      sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1

      // Calcular paginação
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      // Buscar produtos
      const products = await collection
        .find(filters)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit as string))
        .toArray()

      // Contar total
      const total = await collection.countDocuments(filters)

      // Formatar dados
      const formattedProducts = products.map(product => ({
        id: product._id?.toString() || '',
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        owner: product.owner,
        location: product.location,
        inStock: product.inStock,
        isFavorite: product.isFavorite,
        tags: product.tags,
        stock: product.stock,
        seller: product.seller,
        badges: product.badges,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }))

      await client.close()

      return res.status(200).json({
        success: true,
        message: 'Produtos carregados com sucesso',
        data: formattedProducts,
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      })

    } catch (error: any) {
      console.error('Erro na API de marketplace:', error)
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
      const collection = db.collection(COLLECTION_NAME)

      const productData = req.body

      // Validar dados obrigatórios
      if (!productData.name || !productData.price || !productData.category) {
        return res.status(400).json({
          success: false,
          message: 'Dados obrigatórios não fornecidos'
        })
      }

      // Adicionar timestamps
      const newProduct = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
        rating: 0,
        reviews: 0,
        isFavorite: false,
        badges: productData.badges || []
      }

      const result = await collection.insertOne(newProduct)
      await client.close()

      return res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: [{ ...newProduct, id: result.insertedId.toString() }]
      })

    } catch (error: any) {
      console.error('Erro ao criar produto:', error)
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
