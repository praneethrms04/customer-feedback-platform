import compression from 'compression';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import healthRoutes from './routes/health';
import feedbackRoutes from './routes/feedback';
import analyticsRoutes from './routes/analytics';
import authRoutes from './routes/auth';
import { authenticate } from './middlewares/auth';
import { globalLimiter } from './middlewares/rateLimiter';
import { httpLogger, requestDuration } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import config from './config/environment';
import logger from './utils/logger';

const app: Express = express();

app.use(helmet({ contentSecurityPolicy: false }));
const isOriginAllowed = (origin: string): boolean =>
  config.clientUrl.some(
    (allowed) =>
      origin === allowed ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      /^https?:\/\/localhost(:\d+)?$/.test(origin)
  );

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(compression());
app.use(cookieParser());
app.use(httpLogger);
app.use(requestDuration);

app.use(globalLimiter);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Customer Feedback Platform API is running'
  });
});

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/analytics', analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
