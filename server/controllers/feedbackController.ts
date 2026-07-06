import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import AppError from '../utils/AppError';
import {
  createFeedbackService,
  deleteFeedbackService,
  getAllFeedbackService,
  getFeedbackByIdService,
  updateFeedbackService,
  type SortOption
} from '../services/feedbackService';


export const createFeedback = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const feedback = await createFeedbackService(req.body);
  res.status(201).json({
    success: true,
    message: 'Feedback created successfully',
    data: feedback
  });
});

export const getAllFeedback = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { search, category, status, rating, sortBy, page, limit } = req.query as Record<string, string | undefined>;
  const result = await getAllFeedbackService({
    search,
    category,
    status,
    rating,
    sortBy: sortBy as SortOption | undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.status(200).json({
    success: true,
    message: 'Feedback retrieved successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

export const getFeedbackById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const feedback = await getFeedbackByIdService(id);

  if (!feedback) {
    return next(new AppError('Feedback not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Feedback retrieved successfully',
    data: feedback
  });
});

export const updateFeedback = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const feedback = await updateFeedbackService(id, req.body);

  if (!feedback) {
    return next(new AppError('Feedback not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Feedback updated successfully',
    data: feedback
  });
});

export const deleteFeedback = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const feedback = await deleteFeedbackService(id);

  if (!feedback) {
    return next(new AppError('Feedback not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Feedback deleted successfully',
    data: feedback
  });
});
