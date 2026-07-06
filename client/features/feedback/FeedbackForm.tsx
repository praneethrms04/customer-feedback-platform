"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createFeedback } from "@/services/feedback";
import { feedbackSchema, type FeedbackFormValues } from "./feedback-schema";
import { CATEGORIES, MAX_COMMENT_LENGTH } from "@/lib/constants";

export function FeedbackForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      rating: "",
      comment: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      toast.success("Feedback submitted successfully");
      reset();
    },
    onError: () => {
      toast.error("Failed to submit feedback");
    },
  });

  const watchedCategory = watch("category");
  const watchedRating = watch("rating");
  const watchedComment = watch("comment");

  const onSubmit = (values: FeedbackFormValues) => {
    if (!values.rating) return;
    mutation.mutate({ ...values, rating: Number(values.rating) });
  };

  return (
    <Card className="w-full max-w-2xl transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle>Share your feedback</CardTitle>
        <CardDescription>
          Tell us about your experience and help us improve.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Name <span className="text-destructive">*</span>
              </label>
              <Input id="name" placeholder="Enter your name" {...register("name")} />
              {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email <span className="text-destructive">*</span>
              </label>
              <Input id="email" type="email" placeholder="Enter your email" {...register("email")} />
              {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="category">
                Category <span className="text-destructive">*</span>
              </label>
              <Select value={watchedCategory} onValueChange={(value) => { if (value) setValue("category", value); }}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category ? <p className="text-sm text-destructive">{errors.category.message}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="rating">
                Rating <span className="text-destructive">*</span>
              </label>
              <Select value={watchedRating} onValueChange={(value) => { if (value) setValue("rating", value); }}>
                <SelectTrigger id="rating">
                  <SelectValue placeholder="Select a rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Fair</SelectItem>
                  <SelectItem value="3">3 - Good</SelectItem>
                  <SelectItem value="4">4 - Very Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
              {errors.rating ? <p className="text-sm text-destructive">{errors.rating.message}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium" htmlFor="comment">
                Comment <span className="text-destructive">*</span>
              </label>
              <span className="text-xs text-muted-foreground">
                    {(watchedComment || "").length}/{MAX_COMMENT_LENGTH}
              </span>
            </div>
            <Textarea
              id="comment"
              placeholder="Write your feedback here"
              className="min-h-32 resize-y"
              maxLength={MAX_COMMENT_LENGTH}
              {...register("comment")}
            />
            {errors.comment ? <p className="text-sm text-destructive">{errors.comment.message}</p> : null}
          </div>

          <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
            {mutation.isPending ? (
              <>
                <LoaderCircle className="mr-1.5 size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
