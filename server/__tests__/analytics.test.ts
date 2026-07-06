jest.mock('helmet', () => () => (_req: any, _res: any, next: any) => next());
jest.mock('cors', () => () => (_req: any, _res: any, next: any) => next());
jest.mock('compression', () => () => (_req: any, _res: any, next: any) => next());

jest.mock('../middlewares/requestLogger', () => ({
  httpLogger: (_req: any, _res: any, next: any) => next(),
  requestDuration: (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../middlewares/rateLimiter', () => ({
  globalLimiter: (_req: any, _res: any, next: any) => next(),
  authLimiter: (_req: any, _res: any, next: any) => next(),
  feedbackPostLimiter: (_req: any, _res: any, next: any) => next(),
}));

const VALID_TOKEN = 'Bearer valid-test-token';

jest.mock('../middlewares/auth', () => ({
  authenticate: (req: any, res: any, next: any) => {
    if (req.headers?.authorization === VALID_TOKEN) {
      req.admin = { adminId: '507f1f77bcf86cd799439011', email: 'admin@test.com' };
      return next();
    }
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  },
}));

jest.mock('../models/Feedback', () => ({
  create: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
}));

import request from 'supertest';
import app from '../app';
import Feedback from '../models/Feedback';

const mockAggregate = Feedback.aggregate as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockAggregate
    .mockResolvedValueOnce([{ totalFeedback: 10, averageRating: 4.2 }])
    .mockResolvedValueOnce([
      { _id: '1', name: 'John', email: 'john@test.com', category: 'Bug', rating: 4, status: 'Pending', comment: 'test', createdAt: '2025-01-15T10:30:00.000Z' },
      { _id: '2', name: 'Jane', email: 'jane@test.com', category: 'Feature', rating: 5, status: 'Resolved', comment: 'test2', createdAt: '2025-01-14T10:30:00.000Z' },
    ])
    .mockResolvedValueOnce([
      { _id: 'Pending', count: 6 },
      { _id: 'Resolved', count: 3 },
      { _id: 'Reviewed', count: 1 },
    ])
    .mockResolvedValueOnce([
      { category: 'Bug Report', count: 5 },
      { category: 'Feature Request', count: 3 },
      { category: 'General', count: 2 },
    ]);
});

describe('GET /analytics', () => {
  const AUTH_HEADER = { Authorization: VALID_TOKEN };

  describe('authentication', () => {
    it('returns 401 without auth token', async () => {
      const res = await request(app)
        .get('/analytics')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Authentication required');
    });
  });

  describe('success', () => {
    it('returns analytics data with auth', async () => {
      const res = await request(app)
        .get('/analytics')
        .set(AUTH_HEADER)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Analytics retrieved successfully');

      expect(res.body.data).toHaveProperty('totalFeedback', 10);
      expect(res.body.data).toHaveProperty('averageRating', 4.2);
      expect(res.body.data).toHaveProperty('pendingCount', 6);
      expect(res.body.data).toHaveProperty('resolvedCount', 3);

      expect(res.body.data).toHaveProperty('categoryDistribution');
      expect(Array.isArray(res.body.data.categoryDistribution)).toBe(true);
      expect(res.body.data.categoryDistribution).toHaveLength(3);

      expect(res.body.data).toHaveProperty('recentFeedback');
      expect(Array.isArray(res.body.data.recentFeedback)).toBe(true);
      expect(res.body.data.recentFeedback).toHaveLength(2);
    });

    it('returns zero counts when no feedback exists', async () => {
      jest.resetAllMocks();
      mockAggregate.mockResolvedValue([]);

      const res = await request(app)
        .get('/analytics')
        .set(AUTH_HEADER)
        .expect(200);

      expect(res.body.data.totalFeedback).toBe(0);
      expect(res.body.data.averageRating).toBe(0);
      expect(res.body.data.pendingCount).toBe(0);
      expect(res.body.data.resolvedCount).toBe(0);
      expect(res.body.data.categoryDistribution).toEqual([]);
      expect(res.body.data.recentFeedback).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('returns 500 when aggregate throws', async () => {
      jest.resetAllMocks();
      mockAggregate.mockRejectedValue(new Error('Database timeout'));

      const res = await request(app)
        .get('/analytics')
        .set(AUTH_HEADER)
        .expect(500);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Internal server error');
    });
  });
});
