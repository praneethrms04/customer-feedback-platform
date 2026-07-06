export interface FeedbackPayload {
  name: string;
  email: string;
  category: string;
  rating: number;
  comment: string;
}

export interface FeedbackUpdatePayload {
  name?: string;
  email?: string;
  category?: string;
  rating?: number;
  comment?: string;
  status?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface FeedbackItem {
  _id: string;
  name: string;
  email: string;
  category: string;
  rating: number;
  status: string;
  comment: string;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface FeedbackListResponse {
  success: boolean;
  message: string;
  data: FeedbackItem[];
  pagination?: PaginationMeta;
}

export interface FeedbackSingleResponse {
  success: boolean;
  message: string;
  data: FeedbackItem;
}

export interface FeedbackFilters {
  search?: string;
  category?: string;
  status?: string;
  rating?: string;
  page?: number;
  limit?: number;
}
