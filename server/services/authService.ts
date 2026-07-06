import Admin, { IAdmin } from '../models/Admin';
import { signJwt } from '../utils/jwt';
import AppError from '../utils/AppError';
import logger from '../utils/logger';

const DEFAULT_ADMIN = {
  name: 'Admin',
  email: 'admin@feedbackhub.com',
  password: 'admin123!',
};

interface LoginResult {
  token: string;
  admin: Pick<IAdmin, 'name' | 'email' | '_id'>;
}

export const loginService = async (email: string, password: string): Promise<LoginResult> => {
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signJwt({ adminId: admin._id.toString(), email: admin.email });

  return {
    token,
    admin: { name: admin.name, email: admin.email, _id: admin._id },
  };
};

export const getProfileService = async (adminId: string): Promise<Pick<IAdmin, 'name' | 'email' | '_id' | 'createdAt'>> => {
  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new AppError('Admin not found', 404);
  }
  return { name: admin.name, email: admin.email, _id: admin._id, createdAt: admin.createdAt };
};

export const seedAdminService = async (): Promise<void> => {
  const exists = await Admin.findOne({ email: DEFAULT_ADMIN.email });
  if (exists) return;

  await Admin.create(DEFAULT_ADMIN);
  logger.info('Default admin seeded', { email: DEFAULT_ADMIN.email });
};
