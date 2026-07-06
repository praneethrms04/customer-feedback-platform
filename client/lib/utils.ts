import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(dateString).toLocaleDateString("en-US", options);
}

export function formatDateShort(dateString: string) {
  return formatDate(dateString, { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateLong(dateString: string) {
  return formatDate(dateString, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusBadgeVariant(status: string) {
  if (status === "Resolved") return "default";
  if (status === "Reviewed") return "secondary";
  return "outline";
}
