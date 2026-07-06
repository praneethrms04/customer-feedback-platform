import { z } from 'zod';

export const feedbackSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  category: z.string().min(1, 'Please select a category'),
  rating: z.string().min(1, 'Please select a rating'),
  comment: z.string().trim().min(10, 'Comment must be at least 10 characters')
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
