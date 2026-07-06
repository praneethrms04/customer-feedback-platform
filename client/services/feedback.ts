import { get, post, patch, del } from './axios';
import type {
  FeedbackPayload,
  FeedbackUpdatePayload,
  FeedbackResponse,
  FeedbackListResponse,
  FeedbackSingleResponse,
  FeedbackFilters,
} from '@/types/feedback';

export const createFeedback = async (payload: FeedbackPayload): Promise<FeedbackResponse> => {
  return post<FeedbackResponse>('/feedback', payload);
};

export const getFeedbackList = async (filters?: FeedbackFilters): Promise<FeedbackListResponse> => {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.category) params.set('category', filters.category);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.rating) params.set('rating', filters.rating);
  if (filters?.page) params.set('page', String(filters.page));
  if (filters?.limit) params.set('limit', String(filters.limit));
  const query = params.toString();
  return get<FeedbackListResponse>(`/feedback${query ? `?${query}` : ''}`);
};

export const getFeedbackById = async (id: string): Promise<FeedbackSingleResponse> => {
  return get<FeedbackSingleResponse>(`/feedback/${id}`);
};

export const updateFeedback = async (id: string, payload: FeedbackUpdatePayload): Promise<FeedbackSingleResponse> => {
  return patch<FeedbackSingleResponse>(`/feedback/${id}`, payload);
};

export const deleteFeedback = async (id: string): Promise<FeedbackResponse> => {
  return del<FeedbackResponse>(`/feedback/${id}`);
};
