import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../utils/jwt';
import AppError from '../utils/AppError';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;

  if (!token) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const payload = verifyJwt(token);
    (req as any).admin = payload;
    next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
};
