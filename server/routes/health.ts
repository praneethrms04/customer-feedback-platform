import { Router } from 'express';
import mongoose from 'mongoose';
import config from '../config/environment';
import { sendSuccess } from '../utils/response';

const router = Router();

const startTime = Date.now();

router.get('/', (_req, res) => {
  const mongoState = mongoose.connection.readyState;
  const mongoStatus: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const mem = process.memoryUsage();

  res.status(200).json(
    sendSuccess(
      {
        status: 'ok',
        service: 'customer-feedback-platform-api',
        environment: config.nodeEnv,
        uptime: Math.floor((Date.now() - startTime) / 1000),
        timestamp: new Date().toISOString(),
        database: {
          status: mongoStatus[mongoState] || 'unknown',
          readyState: mongoState,
        },
        memory: {
          heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
          heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
          rss: Math.round(mem.rss / 1024 / 1024),
        },
        version: process.env.npm_package_version || '1.0.0',
      },
      'Server is healthy'
    )
  );
});

export default router;
