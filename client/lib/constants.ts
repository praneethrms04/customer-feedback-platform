export const FEEDBACK_STATUSES = ["Pending", "Reviewed", "Resolved"] as const;

export const CATEGORIES = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature Request" },
  { value: "general", label: "General" },
  { value: "improvement", label: "Improvement" },
] as const;

export const RATINGS = [
  { value: "1", label: "1 Star" },
  { value: "2", label: "2 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "5", label: "5 Stars" },
] as const;

export const STALE_TIME = 30_000;
export const DEBOUNCE_MS = 300;
export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_PAGE = 1;
export const MAX_COMMENT_LENGTH = 500;
