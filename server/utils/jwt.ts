import jwt, { type SignOptions } from 'jsonwebtoken';
import config from '../config/environment';

interface JwtPayload {
  adminId: string;
  email: string;
}

const SECRET = config.jwtSecret;
const EXPIRES_IN = config.jwtExpiresIn;

export const signJwt = (payload: JwtPayload): string => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as SignOptions);
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload;
};
