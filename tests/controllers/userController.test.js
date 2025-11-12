// tests/controllers/userController.test.js
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import userController from 'server/controllers/userController.js';
import User from 'server/models/userModel.js';
import sendEmail from 'server/utils/sendEmail.js';

// Mock sendEmail to prevent actual emails during tests
jest.mock('server/utils/sendEmail.js', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(true),
}));

const {
  loginUser,
  signupUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
} = userController;

describe('User Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('signupUser', () => {
    it('should create a new user successfully and send verification email', async () => {
      mockReq.body = {
        email: 'newuser@example.com',
        password: 'SecurePassword123!',
      };

      await signupUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Signup successful. Check your email to verify your account.',
      });

      // Verify user was created in database
      const user = await User.findOne({ email: 'newuser@example.com' });
      expect(user).toBeTruthy();
      expect(user.email).toBe('newuser@example.com');
      expect(user.isVerified).toBe(false);
      expect(user.verificationToken).toBeDefined();
      expect(user.verificationTokenExpires).toBeDefined();
      
      // Verify email was sent
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'newuser@example.com',
          subject: expect.stringContaining('Verify your email'),
        })
      );
    });

    it('should return 400 if email is missing', async () => {
      mockReq.body = {
        password: 'SecurePassword123!',
      };

      await signupUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'All fields are required',
      });
    });

    it('should return 400 if password is missing', async () => {
      mockReq.body = {
        email: 'test@example.com',
      };

      await signupUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'All fields are required',
      });
    });

    it('should return 400 if email is invalid', async () => {
      mockReq.body = {
        email: 'invalid-email',
        password: 'SecurePassword123!',
      };

      await signupUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'A valid email is required',
      });
    });

    it('should return 400 if password is not strong enough', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'weak',
      };

      await signupUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Password not strong enough',
      });
    });

    it('should return 400 if email already exists', async () => {
      // Create user first using the model's signup method
      await User.signup('existing@example.com', 'Password123!');

      mockReq.body = {
        email: 'existing@example.com',
        password: 'SecurePassword123!',
      };

      await signupUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Email already in use',
      });
    });

    it('should handle email sending failure', async () => {
      // Mock sendEmail to throw an error
      sendEmail.mockRejectedValueOnce(new Error('SMTP error'));

      mockReq.body = {
        email: 'test@example.com',
        password: 'SecurePassword123!',
      };

      await signupUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Failed to send verification email. Please try again later.',
      });

      // Verify user's verification token was cleared
      const user = await User.findOne({ email: 'test@example.com' });
      expect(user.verificationToken).toBeUndefined();
      expect(user.verificationTokenExpires).toBeUndefined();
    });
  });

  describe('loginUser', () => {
    beforeEach(async () => {
      // Create and verify a test user
      const user = await User.signup('login@example.com', 'TestPassword123!');
      user.isVerified = true;
      await user.save();
    });

    it('should login successfully with correct credentials', async () => {
      mockReq.body = {
        email: 'login@example.com',
        password: 'TestPassword123!',
      };

      await loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'login@example.com',
          token: expect.any(String),
        })
      );

      // Verify token is valid
      const response = mockRes.json.mock.calls[0][0];
      const decoded = jwt.verify(response.token, process.env.SECRET);
      expect(decoded._id).toBeDefined();
    });

    it('should return 400 if email is missing', async () => {
      mockReq.body = {
        password: 'TestPassword123!',
      };

      await loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'All fields are required',
      });
    });

    it('should return 400 if password is missing', async () => {
      mockReq.body = {
        email: 'login@example.com',
      };

      await loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'All fields are required',
      });
    });

    it('should return 400 if email does not exist', async () => {
      mockReq.body = {
        email: 'nonexistent@example.com',
        password: 'TestPassword123!',
      };

      await loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid email or password',
      });
    });

    it('should return 400 if password is incorrect', async () => {
      mockReq.body = {
        email: 'login@example.com',
        password: 'WrongPassword123!',
      };

      await loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid email or password',
      });
    });

    it('should return 400 if email is not verified', async () => {
      // Create unverified user
      await User.signup('unverified@example.com', 'TestPassword123!');

      mockReq.body = {
        email: 'unverified@example.com',
        password: 'TestPassword123!',
      };

      await loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Please verify your email before logging in.',
      });
    });

    it('should return a JWT token with 3 day expiry', async () => {
      mockReq.body = {
        email: 'login@example.com',
        password: 'TestPassword123!',
      };

      await loginUser(mockReq, mockRes);

      const response = mockRes.json.mock.calls[0][0];
      const decoded = jwt.verify(response.token, process.env.SECRET);
      
      // Check token expires in approximately 3 days (allow 1 minute tolerance)
      const expiresIn = decoded.exp - decoded.iat;
      expect(expiresIn).toBeGreaterThan(3 * 24 * 60 * 60 - 60);
      expect(expiresIn).toBeLessThan(3 * 24 * 60 * 60 + 60);
    });
  });

  describe('verifyEmail', () => {
    let verificationToken;
    let testUser;

    beforeEach(async () => {
      testUser = await User.signup('verify@example.com', 'Password123!');
      verificationToken = testUser.generateEmailVerificationToken();
      await testUser.save();
    });

    it('should verify email with valid token', async () => {
      mockReq.body = {
        token: verificationToken,
      };

      await verifyEmail(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Email verified successfully.',
      });

      // Check user is now verified
      const verifiedUser = await User.findById(testUser._id);
      expect(verifiedUser.isVerified).toBe(true);
      expect(verifiedUser.verificationToken).toBeUndefined();
      expect(verifiedUser.verificationTokenExpires).toBeUndefined();
    });

    it('should return 400 if token is missing', async () => {
      mockReq.body = {};

      await verifyEmail(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Verification token is required.',
      });
    });

    it('should return 400 if token is invalid', async () => {
      mockReq.body = {
        token: 'invalid-token-xyz',
      };

      await verifyEmail(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Verification link is invalid or has expired.',
      });
    });

    it('should return 400 if token has expired', async () => {
      // Set expiry to past date
      testUser.verificationTokenExpires = new Date(Date.now() - 1000);
      await testUser.save();

      mockReq.body = {
        token: verificationToken,
      };

      await verifyEmail(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Verification link is invalid or has expired.',
      });
    });
  });

  describe('requestPasswordReset', () => {
    beforeEach(async () => {
      await User.signup('reset@example.com', 'Password123!');
    });

    it('should create password reset token for valid email', async () => {
      mockReq.body = {
        email: 'reset@example.com',
      };

      await requestPasswordReset(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'If an account exists for that email, a reset link has been sent.',
      });

      // Check reset token was created
      const user = await User.findOne({ email: 'reset@example.com' });
      expect(user.passwordResetToken).toBeDefined();
      expect(user.passwordResetExpires).toBeDefined();

      // Verify email was sent
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'reset@example.com',
          subject: expect.stringContaining('Password reset'),
        })
      );
    });

    it('should return 400 if email is missing', async () => {
      mockReq.body = {};

      await requestPasswordReset(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Email is required.',
      });
    });

    it('should return 200 even if email does not exist (security)', async () => {
      mockReq.body = {
        email: 'nonexistent@example.com',
      };

      await requestPasswordReset(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'If an account exists for that email, a reset link has been sent.',
      });
    });

    it('should handle email sending failure', async () => {
      sendEmail.mockRejectedValueOnce(new Error('SMTP error'));

      mockReq.body = {
        email: 'reset@example.com',
      };

      await requestPasswordReset(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unable to send password reset email. Please try again later.',
      });

      // Verify reset token was cleared
      const user = await User.findOne({ email: 'reset@example.com' });
      expect(user.passwordResetToken).toBeUndefined();
      expect(user.passwordResetExpires).toBeUndefined();
    });
  });

  describe('resetPassword', () => {
    let resetToken;
    let testUser;

    beforeEach(async () => {
      testUser = await User.signup('reset@example.com', 'OldPassword123!');
      resetToken = testUser.generatePasswordResetToken();
      await testUser.save();
    });

    it('should reset password with valid token', async () => {
      mockReq.body = {
        token: resetToken,
        password: 'NewPassword123!',
      };

      await resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Password reset successfully. You can now log in.',
      });

      // Verify password was changed
      const user = await User.findById(testUser._id);
      expect(user.passwordResetToken).toBeUndefined();
      expect(user.passwordResetExpires).toBeUndefined();

      // Verify can login with new password (need to verify user first)
      user.isVerified = true;
      await user.save();
      const loginResult = await User.login('reset@example.com', 'NewPassword123!');
      expect(loginResult).toBeTruthy();
    });

    it('should return 400 if token is missing', async () => {
      mockReq.body = {
        password: 'NewPassword123!',
      };

      await resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Reset token and new password are required.',
      });
    });

    it('should return 400 if password is missing', async () => {
      mockReq.body = {
        token: resetToken,
      };

      await resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Reset token and new password are required.',
      });
    });

    it('should return 400 if password is not strong enough', async () => {
      mockReq.body = {
        token: resetToken,
        password: 'weak',
      };

      await resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Password not strong enough',
      });
    });

    it('should return 400 if token is invalid', async () => {
      mockReq.body = {
        token: 'invalid-token-xyz',
        password: 'NewPassword123!',
      };

      await resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Reset link is invalid or has expired.',
      });
    });

    it('should return 400 if token has expired', async () => {
      // Set expiry to past date
      testUser.passwordResetExpires = new Date(Date.now() - 1000);
      await testUser.save();

      mockReq.body = {
        token: resetToken,
        password: 'NewPassword123!',
      };

      await resetPassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Reset link is invalid or has expired.',
      });
    });
  });
});