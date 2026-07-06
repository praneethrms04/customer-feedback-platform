import rateLimit from 'express-rate-limit';
import config from '../config/environment';

export const globalLimiter = rateLimit({
  windowMs: config.rateLimit.global.windowMs,
  max: config.rateLimit.global.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

export const authLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
  },
  skipSuccessfulRequests: false,
});

export const feedbackPostLimiter = rateLimit({
  windowMs: config.rateLimit.feedbackPost.windowMs,
  max: config.rateLimit.feedbackPost.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many feedback submissions. Please try again later.',
  },
});
