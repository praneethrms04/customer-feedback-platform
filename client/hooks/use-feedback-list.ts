"use client";

import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { getFeedbackList } from "@/services/feedback";
import type { FeedbackFilters } from "@/types/feedback";
import { STALE_TIME } from "@/lib/constants";

export function useFeedbackList(filters: FeedbackFilters) {
  return useQuery({
    queryKey: ["feedback", filters],
    queryFn: () => getFeedbackList(filters),
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
  });
}
