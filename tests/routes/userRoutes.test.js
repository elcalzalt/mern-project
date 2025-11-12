import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import userRoutes from 'server/routes/user.js';
import User from 'server/models/userModel.js';
import sendEmail from 'server/utils/sendEmail.js';

// Mock sendEmail
jest.mock('server/utils/sendEmail.js', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}));

const app = express();
app.use(express.json());
app.use('/api/user', userRoutes);

describe('User Routes Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/user/signup', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/user/signup')
        .send({
          email: 'newuser@example.com',
          password: 'SecurePassword123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Check your email');
    });
  });

  describe('POST /api/user/login', () => {
    beforeEach(async () => {
      const user = await User.signup('login@example.com', 'TestPassword123!');
      user.isVerified = true;
      await user.save();
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/user/login')
        .send({
          email: 'login@example.com',
          password: 'TestPassword123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });
  });

  describe('POST /api/user/verify-email', () => {
    it('should verify email with valid token', async () => {
      const user = await User.signup('verify@example.com', 'Password123!');
      const token = user.generateEmailVerificationToken();
      await user.save();

      const res = await request(app)
        .post('/api/user/verify-email')
        .send({ token });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('verified');
    });
  });

  describe('POST /api/user/request-password-reset', () => {
    it('should send password reset email', async () => {
      await User.signup('reset@example.com', 'Password123!');

      const res = await request(app)
        .post('/api/user/request-password-reset')
        .send({ email: 'reset@example.com' });

      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/user/reset-password', () => {
    it('should reset password with valid token', async () => {
      const user = await User.signup('reset@example.com', 'OldPass123!');
      const token = user.generatePasswordResetToken();
      await user.save();

      const res = await request(app)
        .post('/api/user/reset-password')
        .send({
          token,
          password: 'NewPassword123!',
        });

      expect(res.status).toBe(200);
    });
  });
});