import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/auth/login'

// Mock MongoDB
jest.mock('@/lib/mongodb', () => ({
  connectDB: jest.fn(),
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}))

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockResolvedValue(true),
}))

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockToken'),
}))

describe('/api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    })

    // Mock user found
    const { User } = require('@/lib/mongodb')
    User.findOne.mockResolvedValue({
      _id: 'user123',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'buyer',
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data).toHaveProperty('token')
    expect(data).toHaveProperty('user')
  })

  it('should reject invalid credentials', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'wrongpassword',
      },
    })

    // Mock user not found
    const { User } = require('@/lib/mongodb')
    User.findOne.mockResolvedValue(null)

    await handler(req, res)

    expect(res._getStatusCode()).toBe(401)
    const data = JSON.parse(res._getData())
    expect(data).toHaveProperty('error')
  })

  it('should handle missing credentials', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(400)
    const data = JSON.parse(res._getData())
    expect(data).toHaveProperty('error')
  })

  it('should only accept POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(405)
  })
})
