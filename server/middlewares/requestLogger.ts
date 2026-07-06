import morgan from 'morgan';
import { stream } from '../utils/logger';
import logger from '../utils/logger';
import type { Request, Response, NextFunction } from 'express';

export const httpLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream,
    skip: (_req) => {
      return process.env.NODE_ENV === 'test';
    },
  }
);

export const requestDuration = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';
    logger.log(level, `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
    });
  });

  next();
};
