import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken 
} from '@/utils/auth'

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}))

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockToken'),
  verify: jest.fn().mockReturnValue({ userId: 'mockUserId' }),
}))

describe('Auth Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123'
      const hashed = await hashPassword(password)
      
      expect(hashed).toBe('hashedPassword')
    })
  })

  describe('comparePassword', () => {
    it('should compare password with hash', async () => {
      const password = 'testPassword123'
      const hash = 'hashedPassword'
      
      const result = await comparePassword(password, hash)
      
      expect(result).toBe(true)
    })
  })

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const payload = { userId: 'user123', role: 'buyer' }
      const token = generateToken(payload)
      
      expect(token).toBe('mockToken')
    })
  })

  describe('verifyToken', () => {
    it('should verify a JWT token', () => {
      const token = 'mockToken'
      const decoded = verifyToken(token)
      
      expect(decoded).toEqual({ userId: 'mockUserId' })
    })
  })

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      const payload = { userId: 'user123' }
      const refreshToken = generateRefreshToken(payload)
      
      expect(refreshToken).toBe('mockToken')
    })
  })

  describe('verifyRefreshToken', () => {
    it('should verify a refresh token', () => {
      const refreshToken = 'mockToken'
      const decoded = verifyRefreshToken(refreshToken)
      
      expect(decoded).toEqual({ userId: 'mockUserId' })
    })
  })
})
