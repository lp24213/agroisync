import { 
  validateEmail, 
  validatePassword, 
  validateCPF, 
  validatePhone,
  validateOrderData,
  validatePaymentData 
} from '@/utils/validation'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('test+tag@example.org')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('Password123!')).toBe(true)
      expect(validatePassword('MyStr0ng#Pass')).toBe(true)
    })

    it('should reject weak passwords', () => {
      expect(validatePassword('123456')).toBe(false)
      expect(validatePassword('password')).toBe(false)
      expect(validatePassword('PASSWORD')).toBe(false)
      expect(validatePassword('Pass1')).toBe(false) // Too short
    })
  })

  describe('validateCPF', () => {
    it('should validate correct CPF', () => {
      expect(validateCPF('11144477735')).toBe(true)
      expect(validateCPF('12345678909')).toBe(true)
    })

    it('should reject invalid CPF', () => {
      expect(validateCPF('11111111111')).toBe(false)
      expect(validateCPF('12345678901')).toBe(false)
      expect(validateCPF('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('+5511999999999')).toBe(true)
      expect(validatePhone('11999999999')).toBe(true)
      expect(validatePhone('(11) 99999-9999')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('')).toBe(false)
      expect(validatePhone('invalid')).toBe(false)
    })
  })

  describe('validateOrderData', () => {
    it('should validate complete order data', () => {
      const validOrder = {
        productType: 'soybeans',
        quantity: 1000,
        destination: 'São Paulo',
        deliveryDate: '2024-12-31',
        notes: 'Test order'
      }
      
      expect(validateOrderData(validOrder)).toBe(true)
    })

    it('should reject incomplete order data', () => {
      const invalidOrder = {
        productType: 'soybeans',
        quantity: 0, // Invalid quantity
        destination: '', // Empty destination
      }
      
      expect(validateOrderData(invalidOrder)).toBe(false)
    })
  })

  describe('validatePaymentData', () => {
    it('should validate payment data', () => {
      const validPayment = {
        amount: 1000,
        currency: 'BRL',
        paymentMethod: 'card'
      }
      
      expect(validatePaymentData(validPayment)).toBe(true)
    })

    it('should reject invalid payment data', () => {
      const invalidPayment = {
        amount: 0, // Invalid amount
        currency: '', // Empty currency
      }
      
      expect(validatePaymentData(invalidPayment)).toBe(false)
    })
  })
})
