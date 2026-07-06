"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/services/analytics";
import { STALE_TIME } from "@/lib/constants";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
    staleTime: STALE_TIME,
  });
}
