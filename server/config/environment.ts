import dotenv from 'dotenv';

dotenv.config();

interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  clientUrl: string[];
  rateLimit: {
    global: { windowMs: number; max: number };
    auth: { windowMs: number; max: number };
    feedbackPost: { windowMs: number; max: number };
  };
}

const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:3000,https://customer-feedback-platform.onrender.com';

const config: EnvironmentConfig = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/customer-feedback-platform',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: rawClientUrl.split(',').map((s) => s.trim()),
  rateLimit: {
    global: {
      windowMs: Number(process.env.RATE_LIMIT_GLOBAL_WINDOW_MS) || 15 * 60 * 1000,
      max: Number(process.env.RATE_LIMIT_GLOBAL_MAX) || 300,
    },
    auth: {
      windowMs: Number(process.env.RATE_LIMIT_AUTH_WINDOW_MS) || 15 * 60 * 1000,
      max: Number(process.env.RATE_LIMIT_AUTH_MAX) || 5,
    },
    feedbackPost: {
      windowMs: Number(process.env.RATE_LIMIT_FEEDBACK_POST_WINDOW_MS) || 15 * 60 * 1000,
      max: Number(process.env.RATE_LIMIT_FEEDBACK_POST_MAX) || 10,
    },
  },
};

export default config;
