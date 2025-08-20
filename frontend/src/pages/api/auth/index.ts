import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient, ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

type User = {
  _id?: any
  email: string
  password: string
  name: string
  role: 'user' | 'admin' | 'premium'
  verified: boolean
  profile: {
    avatar?: string
    phone?: string
    location?: string
    bio?: string
  }
  preferences: {
    language: string
    currency: string
    notifications: boolean
  }
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

type AuthResponse = {
  success: boolean
  message: string
  data?: {
    token?: string
    user?: {
      id: string
      email: string
      name: string
      role: string
      verified: boolean
      profile: any
      preferences: any
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync'
const DB_NAME = 'agroisync'
const JWT_SECRET = process.env.JWT_SECRET || 'agroisync-secret-key'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method === 'POST') {
    try {
      const { action, email, password, name, ...otherData } = req.body

      if (!action) {
        return res.status(400).json({
          success: false,
          message: 'Ação não especificada'
        })
      }

      const client = await MongoClient.connect(MONGODB_URI)
      const db = client.db(DB_NAME)
      const usersCollection = db.collection('users')

      switch (action) {
        case 'register':
          if (!email || !password || !name) {
            return res.status(400).json({
              success: false,
              message: 'Email, senha e nome são obrigatórios'
            })
          }

          // Verificar se o usuário já existe
          const existingUser = await usersCollection.findOne({ email: email.toLowerCase() })
          if (existingUser) {
            return res.status(400).json({
              success: false,
              message: 'Usuário já existe com este email'
            })
          }

          // Criptografar senha
          const hashedPassword = await bcrypt.hash(password, 12)

          // Criar usuário
          const newUser: User = {
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            role: 'user',
            verified: false,
            profile: otherData.profile || {},
            preferences: {
              language: 'pt',
              currency: 'BRL',
              notifications: true
            },
            createdAt: new Date(),
            updatedAt: new Date()
          }

          const result = await usersCollection.insertOne(newUser)

          // Gerar token JWT
          const token = jwt.sign(
            { userId: result.insertedId.toString(), email: newUser.email },
            JWT_SECRET,
            { expiresIn: '7d' }
          )

          await client.close()

          return res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            data: {
              token,
              user: {
                id: result.insertedId.toString(),
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                verified: newUser.verified,
                profile: newUser.profile,
                preferences: newUser.preferences
              }
            }
          })

        case 'login':
          if (!email || !password) {
            return res.status(400).json({
              success: false,
              message: 'Email e senha são obrigatórios'
            })
          }

          // Buscar usuário
          const user = await usersCollection.findOne({ email: email.toLowerCase() })
          if (!user) {
            return res.status(401).json({
              success: false,
              message: 'Credenciais inválidas'
            })
          }

          // Verificar senha
          const isValidPassword = await bcrypt.compare(password, user.password)
          if (!isValidPassword) {
            return res.status(401).json({
              success: false,
              message: 'Credenciais inválidas'
            })
          }

          // Atualizar último login
          await usersCollection.updateOne(
            { _id: user._id },
            { 
              $set: { 
                lastLogin: new Date(),
                updatedAt: new Date()
              }
            }
          )

          // Gerar token JWT
          const loginToken = jwt.sign(
            { userId: user._id.toString(), email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
          )

          await client.close()

          return res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
              token: loginToken,
              user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                verified: user.verified,
                profile: user.profile,
                preferences: user.preferences
              }
            }
          })

        case 'verify':
          const { token: verifyToken } = req.body

          if (!verifyToken) {
            return res.status(400).json({
              success: false,
              message: 'Token não fornecido'
            })
          }

          try {
            const decoded = jwt.verify(verifyToken, JWT_SECRET) as any
            const verifiedUser = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) })

            if (!verifiedUser) {
              return res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
              })
            }

            await client.close()

            return res.status(200).json({
              success: true,
              message: 'Token válido',
              data: {
                user: {
                  id: verifiedUser._id.toString(),
                  email: verifiedUser.email,
                  name: verifiedUser.name,
                  role: verifiedUser.role,
                  verified: verifiedUser.verified,
                  profile: verifiedUser.profile,
                  preferences: verifiedUser.preferences
                }
              }
            })

          } catch (jwtError) {
            return res.status(401).json({
              success: false,
              message: 'Token inválido'
            })
          }

        default:
          return res.status(400).json({
            success: false,
            message: 'Ação não reconhecida'
          })
      }

    } catch (error: any) {
      console.error('Erro na autenticação:', error)
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { userId, updates } = req.body

      if (!userId || !updates) {
        return res.status(400).json({
          success: false,
          message: 'ID do usuário e atualizações são obrigatórios'
        })
      }

      const client = await MongoClient.connect(MONGODB_URI)
      const db = client.db(DB_NAME)
      const usersCollection = db.collection('users')

      // Atualizar usuário
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            ...updates,
            updatedAt: new Date()
          }
        }
      )

      if (result.matchedCount === 0) {
        await client.close()
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        })
      }

      await client.close()

      return res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso'
      })

    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error)
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
