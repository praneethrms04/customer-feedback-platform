import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getAnalyticsService } from '../services/analyticsService';

export const getAnalytics = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
  const analytics = await getAnalyticsService();

  res.status(200).json({
    success: true,
    message: 'Analytics retrieved successfully',
    data: analytics
  });
});
