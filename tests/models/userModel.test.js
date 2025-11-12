// tests/models/userModel.test.js
import User from 'server/models/userModel.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

describe('User Model', () => {
  describe('signup static method', () => {
    it('should create a new user with hashed password', async () => {
      const user = await User.signup('test@example.com', 'StrongPassword123!');

      expect(user.email).toBe('test@example.com');
      expect(user.password).not.toBe('StrongPassword123!');
      expect(user.password.length).toBeGreaterThan(20);
      expect(user.isVerified).toBe(false);
    });

    it('should throw error if email is missing', async () => {
      await expect(User.signup('', 'StrongPassword123!'))
        .rejects.toThrow('All fields are required');
    });

    it('should throw error if password is missing', async () => {
      await expect(User.signup('test@example.com', ''))
        .rejects.toThrow('All fields are required');
    });

    it('should throw error if email is invalid', async () => {
      await expect(User.signup('invalid-email', 'StrongPassword123!'))
        .rejects.toThrow('A valid email is required');
    });

    it('should throw error if password is weak', async () => {
      await expect(User.signup('test@example.com', 'weak'))
        .rejects.toThrow('Password not strong enough');
    });

    it('should throw error if email already exists', async () => {
      await User.signup('duplicate@example.com', 'StrongPassword123!');
      
      await expect(User.signup('duplicate@example.com', 'StrongPassword123!'))
        .rejects.toThrow('Email already in use');
    });
  });

  describe('login static method', () => {
    beforeEach(async () => {
      const user = await User.signup('login@example.com', 'TestPassword123!');
      user.isVerified = true;
      await user.save();
    });

    it('should login with correct credentials', async () => {
      const user = await User.login('login@example.com', 'TestPassword123!');
      
      expect(user).toBeTruthy();
      expect(user.email).toBe('login@example.com');
    });

    it('should throw error if email is missing', async () => {
      await expect(User.login('', 'TestPassword123!'))
        .rejects.toThrow('All fields are required');
    });

    it('should throw error if password is missing', async () => {
      await expect(User.login('login@example.com', ''))
        .rejects.toThrow('All fields are required');
    });

    it('should throw error if email does not exist', async () => {
      await expect(User.login('nonexistent@example.com', 'TestPassword123!'))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw error if password is incorrect', async () => {
      await expect(User.login('login@example.com', 'WrongPassword123!'))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw error if email is not verified', async () => {
      await User.signup('unverified@example.com', 'TestPassword123!');
      
      await expect(User.login('unverified@example.com', 'TestPassword123!'))
        .rejects.toThrow('Please verify your email before logging in.');
    });
  });

  describe('generateEmailVerificationToken method', () => {
    it('should generate verification token and set expiry', async () => {
      const user = await User.signup('test@example.com', 'Password123!');
      const token = user.generateEmailVerificationToken();
      
      expect(token).toBeDefined();
      expect(token.length).toBe(64); // 32 bytes = 64 hex chars
      expect(user.verificationToken).toBe(token);
      expect(user.verificationTokenExpires).toBeDefined();
      
      // Check expiry is approximately 24 hours from now
      const expiryDiff = user.verificationTokenExpires - Date.now();
      expect(expiryDiff).toBeGreaterThan(23 * 60 * 60 * 1000);
      expect(expiryDiff).toBeLessThan(25 * 60 * 60 * 1000);
    });
  });

  describe('generatePasswordResetToken method', () => {
    it('should generate reset token and set expiry', async () => {
      const user = await User.signup('test@example.com', 'Password123!');
      const token = user.generatePasswordResetToken();
      
      expect(token).toBeDefined();
      expect(token.length).toBe(64);
      expect(user.passwordResetToken).toBeDefined();
      expect(user.passwordResetExpires).toBeDefined();
      
      // Check expiry is approximately 1 hour from now
      const expiryDiff = user.passwordResetExpires - Date.now();
      expect(expiryDiff).toBeGreaterThan(59 * 60 * 1000);
      expect(expiryDiff).toBeLessThan(61 * 60 * 1000);
    });
  });

  describe('setPassword method', () => {
  it('should hash and set new password', async () => {
    const user = await User.signup('test@example.com', 'OldPassword123!');
    const oldHash = user.password;
    
    await user.setPassword('NewPassword123!');
    
    expect(user.password).not.toBe('NewPassword123!');
    expect(user.password).not.toBe(oldHash);
    expect(user.password.length).toBeGreaterThan(20);
  });

  it('should throw error if new password is weak', async () => {
    const user = await User.signup('test@example.com', 'Password123!');
    
    await expect(user.setPassword('weak'))
      .rejects.toThrow('Password not strong enough');
    });
  });
});