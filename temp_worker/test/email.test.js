// @ts-check
import { 
  getEmailClient, 
  sendWelcomeEmail, 
  sendRecoveryEmail,
  sendOrderConfirmationEmail,
  sendNewMessageEmail 
} from '../src/utils/email.js';

describe('Email Service', () => {
  const mockEnv = {
    RESEND_API_KEY: 'test-api-key',
    RESEND_FROM_EMAIL: 'test@agroisync.com'
  };

  // Mock da função send do Resend
  const mockSend = jest.fn(() => Promise.resolve());

  // Mock do cliente Resend
  class MockResend {
    constructor() {
      this.emails = {
        send: mockSend
      };
    }
  }

  beforeEach(() => {
    mockSend.mockClear();
    global.Resend = MockResend;
  });

  test('getEmailClient retorna cliente configurado', () => {
    const client = getEmailClient(mockEnv);
    expect(client.from).toBe('test@agroisync.com');
    expect(client.client).toBeDefined();
  });

  test('sendWelcomeEmail envia e-mail correto', async () => {
    const client = getEmailClient(mockEnv);
    await sendWelcomeEmail(client, 'user@test.com', 'Test User');

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'test@agroisync.com',
        to: 'user@test.com',
        subject: expect.stringContaining('Bem-vindo'),
        html: expect.stringContaining('Test User')
      })
    );
  });

  test('sendRecoveryEmail envia e-mail correto', async () => {
    const client = getEmailClient(mockEnv);
    await sendRecoveryEmail(client, 'user@test.com', 'Test User', '123456');

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'test@agroisync.com',
        to: 'user@test.com',
        subject: expect.stringContaining('Recuperação'),
        html: expect.stringContaining('123456')
      })
    );
  });

  test('sendOrderConfirmationEmail envia e-mail correto', async () => {
    const client = getEmailClient(mockEnv);
    await sendOrderConfirmationEmail(client, 'user@test.com', 'Test User', 'ORDER123', 99.99);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'test@agroisync.com',
        to: 'user@test.com',
        subject: expect.stringContaining('Confirmação'),
        html: expect.stringContaining('ORDER123')
      })
    );
  });

  test('sendNewMessageEmail envia e-mail correto', async () => {
    const client = getEmailClient(mockEnv);
    await sendNewMessageEmail(client, 'user@test.com', 'Test User', 'Sender Name');

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'test@agroisync.com',
        to: 'user@test.com',
        subject: expect.stringContaining('Nova Mensagem'),
        html: expect.stringContaining('Sender Name')
      })
    );
  });

  test('handles missing RESEND_FROM_EMAIL', () => {
    const envWithoutFrom = { RESEND_API_KEY: 'test-key' };
    const client = getEmailClient(envWithoutFrom);
    expect(client.from).toBe('no-reply@agroisync.com');
  });
});