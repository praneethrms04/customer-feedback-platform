import { NextFunction, Request, Response } from 'express';

export const asyncHandler = <T extends Request, U extends Response, V extends NextFunction>(
  fn: (req: T, res: U, next: V) => Promise<unknown>
) => {
  return (req: T, res: U, next: V): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
