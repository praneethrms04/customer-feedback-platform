import app from './app';
import { connectToMongoDB } from './config/database';
import config from './config/environment';
import { seedAdminService } from './services/authService';
import logger from './utils/logger';


process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION', { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  logger.error('UNHANDLED REJECTION', { error: error.message, stack: error.stack });
  process.exit(1);
});

const startServer = async (): Promise<void> => {
  await connectToMongoDB();
  await seedAdminService();

  const server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  });

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    logger.warn(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
};

startServer().catch((error) => {
  logger.error('Failed to start server', { error: error instanceof Error ? error.message : String(error) });
  process.exit(1);
});
