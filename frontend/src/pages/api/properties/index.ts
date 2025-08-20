import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ObjectId } from 'mongodb'

type Property = {
  _id?: string
  name: string
  description: string
  price: number
  originalPrice?: number
  size: number
  type: string
  location: string
  owner: string
  image: string
  rating: number
  reviews: number
  isFavorite: boolean
  soilType: string
  climate: string
  infrastructure: string[]
  waterResources: string[]
  access: string
  documents: string[]
  tags: string[]
  crops: string[]
  coordinates: {
    lat: number
    lng: number
  }
  createdAt: Date
  updatedAt: Date
}

type PropertiesResponse = {
  success: boolean
  message: string
  data?: Property[]
  total?: number
  page?: number
  limit?: number
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync'
const DB_NAME = 'agroisync'
const COLLECTION_NAME = 'properties'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PropertiesResponse>
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
        type, 
        search, 
        minPrice, 
        maxPrice,
        minSize,
        maxSize,
        location,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query

      // Construir filtros
      const filters: any = {}
      
      if (type && type !== 'all') {
        filters.type = type
      }
      
      const searchFilter = search ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search.toString(), 'i')] } },
          { crops: { $in: [new RegExp(search.toString(), 'i')] } }
        ]
      } : {}
      
      if (minPrice || maxPrice) {
        filters.price = {}
        if (minPrice) filters.price.$gte = parseFloat(minPrice as string)
        if (maxPrice) filters.price.$lte = parseFloat(maxPrice as string)
      }

      if (minSize || maxSize) {
        filters.size = {}
        if (minSize) filters.size.$gte = parseFloat(minSize as string)
        if (maxSize) filters.size.$lte = parseFloat(maxSize as string)
      }

      if (location) {
        filters.location = { $regex: location, $options: 'i' }
      }

      // Construir ordenação
      const sort: any = {}
      sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1

      // Calcular paginação
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string)

      // Buscar propriedades
      const properties = await collection
        .find(filters)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit as string))
        .toArray()

      // Contar total
      const total = await collection.countDocuments(filters)

      // Formatar dados
      const formattedProperties = properties.map(property => ({
        id: property._id?.toString() || '',
        name: property.name,
        description: property.description,
        price: property.price,
        originalPrice: property.originalPrice,
        size: property.size,
        type: property.type,
        location: property.location,
        owner: property.owner,
        image: property.image,
        rating: property.rating,
        reviews: property.reviews,
        isFavorite: property.isFavorite,
        soilType: property.soilType,
        climate: property.climate,
        waterSource: property.waterSource,
        access: property.access,
        infrastructure: property.infrastructure,
        waterResources: property.waterResources || [],
        crops: property.crops,
        tags: property.tags,
        documents: property.documents || [],
        coordinates: property.coordinates,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt
      }))

      await client.close()

      return res.status(200).json({
        success: true,
        message: 'Propriedades carregadas com sucesso',
        data: formattedProperties,
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      })

    } catch (error: any) {
      console.error('Erro na API de properties:', error)
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

      const propertyData = req.body

      // Validar dados obrigatórios
      if (!propertyData.name || !propertyData.price || !propertyData.size || !propertyData.type) {
        return res.status(400).json({
          success: false,
          message: 'Dados obrigatórios não fornecidos'
        })
      }

      // Adicionar timestamps
      const newProperty = {
        ...propertyData,
        createdAt: new Date(),
        updatedAt: new Date(),
        rating: 0,
        reviews: 0,
        isFavorite: false,
        tags: propertyData.tags || [],
        crops: propertyData.crops || [],
        infrastructure: propertyData.infrastructure || [],
        waterResources: propertyData.waterResources || [],
        documents: propertyData.documents || []
      }

      const result = await collection.insertOne(newProperty)
      await client.close()

      return res.status(201).json({
        success: true,
        message: 'Propriedade criada com sucesso',
        data: [{ ...newProperty, id: result.insertedId.toString() }]
      })

    } catch (error: any) {
      console.error('Erro ao criar propriedade:', error)
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
