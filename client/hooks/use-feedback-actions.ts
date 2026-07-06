"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteFeedback,
  updateFeedback,
} from "@/services/feedback";

export function useFeedbackActions() {
  const queryClient = useQueryClient();
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteFeedback,
    onSuccess: () => {
      toast.success("Feedback deleted");
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
    onError: () => toast.error("Failed to delete feedback"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateFeedback(id, { status }),
    onMutate: ({ id }) => setPendingStatusId(id),
    onSettled: () => setPendingStatusId(null),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  return { deleteMutation, statusMutation, pendingStatusId };
}

export function useFeedbackDetailActions(id: string, onDeleteSuccess?: () => void) {
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: (status: string) => updateFeedback(id, { status }),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["feedback", id] });
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteFeedback(id),
    onSuccess: () => {
      toast.success("Feedback deleted");
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      onDeleteSuccess?.();
    },
    onError: () => toast.error("Failed to delete feedback"),
  });

  return { statusMutation, deleteMutation };
}
