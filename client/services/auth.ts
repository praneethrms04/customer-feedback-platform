import { post, get } from './axios';
import type { LoginPayload, LoginResult, AdminProfile, ApiResponse } from '@/types/auth';

export const login = async (payload: LoginPayload): Promise<ApiResponse<LoginResult>> => {
  return post<ApiResponse<LoginResult>>('/auth/login', payload);
};

export const getProfile = async (): Promise<ApiResponse<AdminProfile>> => {
  return get<ApiResponse<AdminProfile>>('/auth/me');
};
