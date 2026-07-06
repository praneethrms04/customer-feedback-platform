import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';

export const notFound = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError('Route not found', 404));
};
