import type { FeedbackItem } from "./feedback";

export interface AnalyticsItem {
  category: string;
  count: number;
}

export interface AnalyticsData {
  totalFeedback: number;
  averageRating: number;
  pendingCount: number;
  resolvedCount: number;
  categoryDistribution: AnalyticsItem[];
  recentFeedback: FeedbackItem[];
}

export interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: AnalyticsData;
}
