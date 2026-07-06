import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { loginService, getProfileService } from '../services/authService';
import AppError from '../utils/AppError';
import config from '../config/environment';

export const login = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const result = await loginService(email, password);

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { admin: result.admin },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
  res.clearCookie('token', { path: '/' });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const adminId = (req as any).admin?.adminId;
  if (!adminId) {
    throw new AppError('Not authenticated', 401);
  }

  const admin = await getProfileService(adminId);

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: admin,
  });
});
