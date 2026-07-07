import mongoose, { Mongoose } from 'mongoose';
import config from './environment';
import logger from '../utils/logger';

const connectToMongoDB = async (): Promise<Mongoose> => {
  try {
    if (!config.mongoUri) {
      throw new Error('MongoDB connection string is missing');
    }

    await mongoose.connect(config.mongoUri);
    logger.info('MongoDB connected successfully');
    return mongoose;
  } catch (error) {
    logger.error('MongoDB connection failed', { error });
    process.exit(1);
  }
};

const disconnectFromMongoDB = async (): Promise<void> => {
  await mongoose.connection.close();
};

export { connectToMongoDB, disconnectFromMongoDB };
