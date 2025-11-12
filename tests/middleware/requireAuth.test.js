// tests/middleware/requireAuth.test.js
import jwt from 'jsonwebtoken';
import requireAuth from 'server/middleware/requireAuth.js';
import User from 'server/models/userModel.js';
import mongoose from 'mongoose';

describe('requireAuth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let testUser;

  beforeEach(async () => {
    // Create a real test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'hashedpassword123',
    });

    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should authenticate valid token', async () => {
    const token = jwt.sign({ _id: testUser._id }, process.env.SECRET);
    mockReq.headers.authorization = `Bearer ${token}`;

    await requireAuth(mockReq, mockRes, mockNext);

    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.email).toBe('test@example.com');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 401 if no authorization header', async () => {
    await requireAuth(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Authorization token required',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization does not start with Bearer', async () => {
    mockReq.headers.authorization = 'Token abc123';

    await requireAuth(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Authorization token required',
    });
  });

  it('should return 401 if token is invalid', async () => {
    mockReq.headers.authorization = 'Bearer invalid-token';

    await requireAuth(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Request is not authorized',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if user not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const token = jwt.sign({ _id: nonExistentId }, process.env.SECRET);
    mockReq.headers.authorization = `Bearer ${token}`;

    await requireAuth(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'User not found',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});