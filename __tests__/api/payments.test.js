import { createMocks } from 'node-mocks-http'
import handler from '@/pages/api/payments'

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
        status: 'requires_payment_method',
      }),
      retrieve: jest.fn().mockResolvedValue({
        id: 'pi_test_123',
        status: 'succeeded',
      }),
    },
  }))
})

// Mock MongoDB
jest.mock('@/lib/mongodb', () => ({
  connectDB: jest.fn(),
  Payment: {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
  Order: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}))

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ userId: 'user123' }),
}))

describe('/api/payments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/payments', () => {
    it('should create payment intent', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          authorization: 'Bearer mockToken',
        },
        body: {
          orderId: 'order123',
          amount: 1000,
          currency: 'BRL',
        },
      })

      // Mock order found
      const { Order } = require('@/lib/mongodb')
      Order.findById.mockResolvedValue({
        _id: 'order123',
        totalAmount: 1000,
        buyer: 'user123',
      })

      // Mock payment creation
      const { Payment } = require('@/lib/mongodb')
      Payment.create.mockResolvedValue({
        _id: 'payment123',
        orderId: 'order123',
        amount: 1000,
        status: 'pending',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      const data = JSON.parse(res._getData())
      expect(data).toHaveProperty('clientSecret')
    })

    it('should validate payment data', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          authorization: 'Bearer mockToken',
        },
        body: {
          // Missing required fields
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data).toHaveProperty('error')
    })

    it('should handle order not found', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          authorization: 'Bearer mockToken',
        },
        body: {
          orderId: 'nonexistent',
          amount: 1000,
          currency: 'BRL',
        },
      })

      // Mock order not found
      const { Order } = require('@/lib/mongodb')
      Order.findById.mockResolvedValue(null)

      await handler(req, res)

      expect(res._getStatusCode()).toBe(404)
      const data = JSON.parse(res._getData())
      expect(data).toHaveProperty('error')
    })
  })

  describe('PUT /api/payments', () => {
    it('should confirm payment', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        headers: {
          authorization: 'Bearer mockToken',
        },
        body: {
          paymentIntentId: 'pi_test_123',
        },
      })

      // Mock payment found
      const { Payment } = require('@/lib/mongodb')
      Payment.findById.mockResolvedValue({
        _id: 'payment123',
        paymentIntentId: 'pi_test_123',
        status: 'pending',
      })

      // Mock payment update
      Payment.findByIdAndUpdate.mockResolvedValue({
        _id: 'payment123',
        status: 'succeeded',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data).toHaveProperty('payment')
    })
  })
})
