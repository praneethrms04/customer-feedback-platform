import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

export const validateRequest = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.flatten().fieldErrors
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Validation middleware error'
      });
    }
  };
};
