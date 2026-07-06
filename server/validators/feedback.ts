import { z } from 'zod';

export const feedbackStatusSchema = z.enum(['Pending', 'Reviewed', 'Resolved']);

export const createFeedbackSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  category: z.string().trim().min(2, 'Category must be at least 2 characters').max(50, 'Category cannot exceed 50 characters'),
  rating: z.number().int('Rating must be a whole number').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().trim().min(5, 'Comment must be at least 5 characters').max(2000, 'Comment cannot exceed 2000 characters'),
  status: feedbackStatusSchema.optional().default('Pending')
});

export const updateFeedbackSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters').optional(),
  email: z.string().trim().email('Please enter a valid email address').toLowerCase().optional(),
  category: z.string().trim().min(2, 'Category must be at least 2 characters').max(50, 'Category cannot exceed 50 characters').optional(),
  rating: z.number().int('Rating must be a whole number').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
  comment: z.string().trim().min(5, 'Comment must be at least 5 characters').max(2000, 'Comment cannot exceed 2000 characters').optional(),
  status: feedbackStatusSchema.optional()
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type UpdateFeedbackInput = z.infer<typeof updateFeedbackSchema>;
