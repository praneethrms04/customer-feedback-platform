"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, X } from "lucide-react";

import type { FeedbackItem, FeedbackFilters } from "@/types/feedback";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDateShort } from "@/lib/utils";
import {
  FEEDBACK_STATUSES,
  CATEGORIES,
  RATINGS,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE,
} from "@/lib/constants";
import { RatingDisplay } from "@/components/rating-display";
import { DataTable } from "@/components/data-table";
import { FilterSelect } from "@/components/filter-select";
import { SearchField } from "@/components/search-field";
import { useFilterParams } from "@/hooks/use-filter-params";
import { useFeedbackActions } from "@/hooks/use-feedback-actions";
import { useFeedbackList } from "@/hooks/use-feedback-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

function AdminFeedbackContent() {
  const {
    searchInput,
    setSearchInput,
    debouncedSearch,
    updateURL,
    clearFilters,
    hasFilters,
    searchParams,
  } = useFilterParams();

  const categoryParam = searchParams.get("category") || "";
  const statusParam = searchParams.get("status") || "";
  const ratingParam = searchParams.get("rating") || "";
  const pageParam = Math.max(1, Number(searchParams.get("page")) || 1);

  const filters: FeedbackFilters = {
    page: pageParam,
    limit: DEFAULT_PAGE_LIMIT,
  };
  if (debouncedSearch) filters.search = debouncedSearch;
  if (categoryParam) filters.category = categoryParam;
  if (statusParam) filters.status = statusParam;
  if (ratingParam) filters.rating = ratingParam;

  const { data, isLoading, isError, isFetching } = useFeedbackList(filters);

  const { deleteMutation, statusMutation, pendingStatusId } =
    useFeedbackActions();

  const feedbackList = data?.data ?? [];
  const pagination = data?.pagination ?? null;

  const columns: ColumnDef<FeedbackItem>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: "Email",
        enableSorting: true,
      },
      {
        accessorKey: "category",
        header: "Category",
        enableSorting: true,
        cell: ({ row }) => (
          <Badge variant="secondary" className="capitalize">
            {row.getValue("category")}
          </Badge>
        ),
      },
      {
        accessorKey: "comment",
        header: "Comment",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="line-clamp-1 max-w-xs text-muted-foreground">
            {row.getValue("comment")}
          </span>
        ),
      },
      {
        accessorKey: "rating",
        header: "Rating",
        enableSorting: true,
        cell: ({ row }) => (
          <RatingDisplay rating={row.getValue("rating")} />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => (
          <Select
            value={row.original.status}
            disabled={pendingStatusId === row.original._id}
            onValueChange={(value) =>
              value &&
              statusMutation.mutate({
                id: row.original._id,
                status: value,
              })
            }
          >
            <SelectTrigger
              className="h-7 w-28 text-xs"
              aria-label={`Change status for ${row.original.name}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FEEDBACK_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDateShort(row.getValue("createdAt"))}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Link
              href={`/admin/feedback/${row.original._id}`}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-xs" })
              )}
              aria-label={`View feedback from ${row.original.name}`}
            >
              <Eye className="size-3.5" />
            </Link>
            <DeleteConfirmDialog
              onDelete={() => deleteMutation.mutate(row.original._id)}
              isPending={deleteMutation.isPending}
              triggerAriaLabel={`Delete feedback from ${row.original.name}`}
              iconOnly
            />
          </div>
        ),
      },
    ],
    [pendingStatusId, statusMutation, deleteMutation]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchField
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Search name, email, comment..."
          aria-label="Search feedback"
        />

        <FilterSelect
          value={categoryParam}
          onValueChange={(v) => updateURL({ category: v })}
          options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
          placeholder="Categories"
        />
        <FilterSelect
          value={statusParam}
          onValueChange={(v) => updateURL({ status: v })}
          options={FEEDBACK_STATUSES.map((s) => ({ value: s, label: s }))}
          placeholder="Statuses"
        />
        <FilterSelect
          value={ratingParam}
          onValueChange={(v) => updateURL({ rating: v })}
          options={RATINGS.map((r) => ({ value: r.value, label: r.label }))}
          placeholder="Ratings"
        />

        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 size-3.5" />
            Clear
          </Button>
        ) : null}
      </div>

      <DataTable<FeedbackItem>
        columns={columns}
        data={feedbackList}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        errorMessage="Failed to load feedback"
        emptyMessage={
          hasFilters
            ? "No feedback matches your filters"
            : "No feedback submissions yet"
        }
        pagination={pagination}
        onPageChange={(page) => updateURL({ page: String(page) })}
      />
    </div>
  );
}

export default function AdminFeedback() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 w-full rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <AdminFeedbackContent />
    </Suspense>
  );
}
