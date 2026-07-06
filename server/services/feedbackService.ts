import Feedback, { IFeedback } from '../models/Feedback';
import { CreateFeedbackInput, UpdateFeedbackInput } from '../validators/feedback';

export const createFeedbackService = async (data: CreateFeedbackInput) => {
  const feedback = await Feedback.create(data);
  return feedback;
};

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'highest'
  | 'lowest'
  | 'category-asc'
  | 'category-desc';

interface FeedbackFilters {
  search?: string;
  category?: string;
  status?: string;
  rating?: string;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

const sortMap: Record<SortOption, Record<string, 1 | -1>> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  highest: { rating: -1, createdAt: -1 },
  lowest: { rating: 1, createdAt: -1 },
  'category-asc': { category: 1, createdAt: -1 },
  'category-desc': { category: -1, createdAt: -1 },
};

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

const escapeRegex = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildQuery = (filters: FeedbackFilters = {}): Record<string, unknown> => {
  const query: Record<string, unknown> = {};

  if (filters.search) {
    const escaped = escapeRegex(filters.search);
    const regex = new RegExp(escaped, 'i');
    query.$or = [
      { name: regex },
      { email: regex },
      { comment: regex },
    ];
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.rating) {
    const ratingNum = Number(filters.rating);
    if (!isNaN(ratingNum)) {
      query.rating = ratingNum;
    }
  }

  return query;
};

export const getAllFeedbackService = async (filters: FeedbackFilters = {}): Promise<PaginatedResult<Record<string, unknown>>> => {
  const query = buildQuery(filters);
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 10));
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = filters.sortBy ? sortMap[filters.sortBy] : { createdAt: -1 };

  const [data, total] = await Promise.all([
    Feedback.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Feedback.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    },
  };
};

export const getFeedbackByIdService = async (id: string) => {
  return Feedback.findById(id);
};

export const updateFeedbackService = async (id: string, data: UpdateFeedbackInput) => {
  return Feedback.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
};

export const deleteFeedbackService = async (id: string) => {
  return Feedback.findByIdAndDelete(id);
};
