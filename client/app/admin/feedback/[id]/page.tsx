"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDateLong, getStatusBadgeVariant } from "@/lib/utils";
import { FEEDBACK_STATUSES } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RatingDisplay } from "@/components/rating-display";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useFeedback } from "@/hooks/use-feedback";
import { useFeedbackDetailActions } from "@/hooks/use-feedback-actions";

export default function FeedbackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data, isLoading, isError } = useFeedback(id);
  const { statusMutation, deleteMutation } = useFeedbackDetailActions(
    id,
    () => router.push("/admin/feedback"),
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/feedback"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <ArrowLeft className="mr-1 size-3.5" />
          Back
        </Link>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-8 w-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Feedback not found</p>
        <Link
          href="/admin/feedback"
          className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
        >
          Back to Feedback
        </Link>
      </div>
    );
  }

  const feedback = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/feedback"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <ArrowLeft className="mr-1 size-3.5" />
          Back
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{feedback.name}</CardTitle>
              <CardDescription>{feedback.email}</CardDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(feedback.status)}>
              {feedback.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Category</p>
              <Badge variant="secondary" className="mt-1">
                {feedback.category}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Rating</p>
              <div className="mt-1">
                <RatingDisplay rating={feedback.rating} size="md" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Submitted</p>
              <p className="mt-1 text-sm">{formatDateLong(feedback.createdAt)}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">Comment</p>
            <p className="mt-2 text-sm leading-relaxed">{feedback.comment}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">Status</p>
            <Select
              value={feedback.status}
              disabled={statusMutation.isPending}
              onValueChange={(value) => value && statusMutation.mutate(value)}
            >
              <SelectTrigger className="mt-1 w-40" aria-label="Change feedback status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FEEDBACK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <DeleteConfirmDialog
            onDelete={() => deleteMutation.mutate()}
            isPending={deleteMutation.isPending}
            triggerAriaLabel="Delete this feedback"
          />
        </CardFooter>
      </Card>
    </div>
  );
}
