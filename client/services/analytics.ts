import { get } from './axios';
import type { AnalyticsResponse } from '@/types/analytics';

export const getAnalytics = async (): Promise<AnalyticsResponse> => {
  return get<AnalyticsResponse>('/analytics');
};
