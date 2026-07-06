"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label"?: string;
  className?: string;
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search...",
  "aria-label": ariaLabel = "Search",
  className,
}: SearchFieldProps) {
  return (
    <div className={`relative flex-1 min-w-[200px] max-w-sm ${className ?? ""}`}>
      <Search
        aria-hidden="true"
        className="absolute left-2.5 inset-y-0 my-auto size-4 text-muted-foreground pointer-events-none"
      />
      <Input
        aria-label={ariaLabel}
        placeholder={placeholder}
        className="pl-8 pr-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value ? (
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Clear search"
          className="absolute right-1 inset-y-0 my-auto cursor-pointer"
          onClick={() => onChange("")}
        >
          <X className="size-3.5" />
        </Button>
      ) : null}
    </div>
  );
}
