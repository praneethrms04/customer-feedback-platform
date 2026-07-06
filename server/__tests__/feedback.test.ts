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

jest.mock('../models/Feedback', () => {
  const mockFeedback = {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    category: 'Bug Report',
    rating: 4,
    comment: 'Great product but has a minor bug.',
    status: 'Pending',
    createdAt: '2025-01-15T10:30:00.000Z',
    updatedAt: '2025-01-15T10:30:00.000Z',
  };

  const mockFeedbackList = [mockFeedback];

  const createQuery = () => ({
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue(mockFeedbackList),
  });

  return {
    create: jest.fn().mockResolvedValue(mockFeedback),
    find: jest.fn().mockReturnValue(createQuery()),
    countDocuments: jest.fn().mockResolvedValue(1),
    findById: jest.fn().mockResolvedValue(mockFeedback),
    aggregate: jest.fn().mockResolvedValue([
      { totalFeedback: 1, averageRating: 4 },
    ]),
  };
});

import request from 'supertest';
import app from '../app';
import Feedback from '../models/Feedback';

const mockCreate = Feedback.create as jest.Mock;
const mockFind = Feedback.find as jest.Mock;
const mockCount = Feedback.countDocuments as jest.Mock;

const VALID_PAYLOAD = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  category: 'Feature Request',
  rating: 5,
  comment: 'Amazing platform, would love to see dark mode support.',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('POST /feedback', () => {
  describe('success', () => {
    it('creates feedback with valid payload and returns 201', async () => {
      const res = await request(app)
        .post('/feedback')
        .send(VALID_PAYLOAD)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Feedback created successfully');
      expect(res.body.data).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
      });
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledWith({ ...VALID_PAYLOAD, status: 'Pending' });
    });

    it('accepts payload with all optional fields (status provided)', async () => {
      const payload = { ...VALID_PAYLOAD, status: 'Pending' };
      const res = await request(app)
        .post('/feedback')
        .send(payload)
        .expect(201);

      expect(res.body.success).toBe(true);
    });
  });

  describe('validation failures', () => {
    it('returns 400 when name is missing', async () => {
      const { name: _, ...payload } = VALID_PAYLOAD;
      const res = await request(app)
        .post('/feedback')
        .send(payload)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
      expect(res.body.errors).toHaveProperty('name');
    });

    it('returns 400 when name is too short', async () => {
      const res = await request(app)
        .post('/feedback')
        .send({ ...VALID_PAYLOAD, name: 'A' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('name');
    });

    it('returns 400 when email is invalid', async () => {
      const res = await request(app)
        .post('/feedback')
        .send({ ...VALID_PAYLOAD, email: 'not-an-email' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('email');
    });

    it('returns 400 when email is missing', async () => {
      const { email: _, ...payload } = VALID_PAYLOAD;
      const res = await request(app)
        .post('/feedback')
        .send(payload)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('email');
    });

    it('returns 400 when rating is below minimum', async () => {
      const res = await request(app)
        .post('/feedback')
        .send({ ...VALID_PAYLOAD, rating: 0 })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('rating');
    });

    it('returns 400 when rating is above maximum', async () => {
      const res = await request(app)
        .post('/feedback')
        .send({ ...VALID_PAYLOAD, rating: 6 })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('rating');
    });

    it('returns 400 when rating is not an integer', async () => {
      const res = await request(app)
        .post('/feedback')
        .send({ ...VALID_PAYLOAD, rating: 3.5 })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('rating');
    });

    it('returns 400 when comment is too short', async () => {
      const res = await request(app)
        .post('/feedback')
        .send({ ...VALID_PAYLOAD, comment: 'Hi' })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('comment');
    });

    it('returns 400 when comment is missing', async () => {
      const { comment: _, ...payload } = VALID_PAYLOAD;
      const res = await request(app)
        .post('/feedback')
        .send(payload)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('comment');
    });

    it('returns 400 when category is missing', async () => {
      const { category: _, ...payload } = VALID_PAYLOAD;
      const res = await request(app)
        .post('/feedback')
        .send(payload)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toHaveProperty('category');
    });

    it('returns 400 with empty body', async () => {
      const res = await request(app)
        .post('/feedback')
        .send({})
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation failed');
    });
  });

  describe('error handling', () => {
    it('returns 500 when service throws', async () => {
      mockCreate.mockRejectedValueOnce(new Error('Database connection failed'));

      const res = await request(app)
        .post('/feedback')
        .send(VALID_PAYLOAD)
        .expect(500);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Internal server error');
    });
  });
});

describe('GET /feedback', () => {
  const AUTH_HEADER = { Authorization: VALID_TOKEN };

  describe('authentication', () => {
    it('returns 401 without auth token', async () => {
      const res = await request(app)
        .get('/feedback')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Authentication required');
    });
  });

  describe('success', () => {
    it('returns paginated feedback list with auth', async () => {
      const res = await request(app)
        .get('/feedback')
        .set(AUTH_HEADER)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Feedback retrieved successfully');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      });
    });

    it('passes query parameters to the service', async () => {
      mockCount.mockResolvedValueOnce(0);
      const leanMock = jest.fn().mockResolvedValueOnce([]);
      const queryMock = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: leanMock,
      };
      mockFind.mockReturnValueOnce(queryMock);

      await request(app)
        .get('/feedback')
        .set(AUTH_HEADER)
        .query({ search: 'bug', category: 'Bug Report', status: 'Pending', rating: '4', sortBy: 'newest', page: '2', limit: '5' })
        .expect(200);

      expect(mockFind).toHaveBeenCalled();
    });

    it('returns empty array when no feedback exists', async () => {
      mockCount.mockResolvedValueOnce(0);
      const leanMock = jest.fn().mockResolvedValueOnce([]);
      const queryMock = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: leanMock,
      };
      mockFind.mockReturnValueOnce(queryMock);

      const res = await request(app)
        .get('/feedback')
        .set(AUTH_HEADER)
        .expect(200);

      expect(res.body.data).toHaveLength(0);
      expect(res.body.pagination.total).toBe(0);
    });
  });

  describe('error handling', () => {
    it('returns 500 when service throws', async () => {
      mockFind.mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });

      const res = await request(app)
        .get('/feedback')
        .set(AUTH_HEADER)
        .expect(500);

      expect(res.body.success).toBe(false);
    });
  });
});
