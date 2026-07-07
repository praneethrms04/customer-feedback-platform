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

const app: Express = express();

app.use(helmet({ contentSecurityPolicy: false }));
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
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
