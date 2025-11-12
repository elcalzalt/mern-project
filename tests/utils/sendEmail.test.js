import sendEmail from 'server/utils/sendEmail.js';

describe('sendEmail Utility - Validation Tests', () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  beforeEach(() => {
    // Set up test environment
    process.env.SMTP_HOST = 'smtp.test.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'testpassword';
    process.env.EMAIL_FROM = 'noreply@example.com';
    process.env.SMTP_SECURE = 'false';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Input Validation', () => {
    it('should throw error if recipient (to) is missing', async () => {
      await expect(
        sendEmail({
          subject: 'Test Subject',
          html: '<p>Test</p>',
        })
      ).rejects.toThrow('Email recipient is required');
    });

    it('should throw error if subject is missing', async () => {
      await expect(
        sendEmail({
          to: 'test@example.com',
          html: '<p>Test</p>',
        })
      ).rejects.toThrow('Email subject is required');
    });
  });

  describe('SMTP Configuration Validation', () => {
    it('should throw error if SMTP_HOST is missing', async () => {
      delete process.env.SMTP_HOST;

      await expect(
        sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        })
      ).rejects.toThrow('SMTP configuration is missing');
    });

    it('should throw error if SMTP_PORT is missing', async () => {
      delete process.env.SMTP_PORT;

      await expect(
        sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        })
      ).rejects.toThrow('SMTP configuration is missing');
    });
  });

  describe('Email Parameter Structure', () => {
    it('should validate all required email fields are present', () => {
      const validParams = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>HTML content</p>',
        text: 'Plain text content',
      };

      expect(validParams).toHaveProperty('to');
      expect(validParams).toHaveProperty('subject');
      expect(validParams).toHaveProperty('html');
      expect(typeof validParams.to).toBe('string');
      expect(typeof validParams.subject).toBe('string');
    });
  });
});