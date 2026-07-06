"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeedbackById } from "@/services/feedback";
import { STALE_TIME } from "@/lib/constants";

export function useFeedback(id: string) {
  return useQuery({
    queryKey: ["feedback", id],
    queryFn: () => getFeedbackById(id),
    staleTime: STALE_TIME,
  });
}
