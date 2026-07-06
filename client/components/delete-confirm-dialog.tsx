"use client";

import type { ReactNode } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface DeleteConfirmDialogProps {
  onDelete: () => void;
  isPending: boolean;
  children?: ReactNode;
  triggerAriaLabel?: string;
  iconOnly?: boolean;
}

export function DeleteConfirmDialog({
  onDelete,
  isPending,
  children,
  triggerAriaLabel = "Delete",
  iconOnly = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        aria-label={triggerAriaLabel}
        className={cn(
          iconOnly
            ? buttonVariants({ variant: "ghost", size: "icon-xs" })
            : undefined,
          "cursor-pointer",
        )}
      >
        {iconOnly ? (
          <Trash2 className="size-3.5 text-destructive" />
        ) : (
          <>
            <Trash2 className="mr-1 size-3.5" />
            {children ?? "Delete"}
          </>
        )}
      </AlertDialogTrigger>

      <AlertDialogPopup>
        <AlertDialogTitle>Delete Feedback?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the selected feedback.
        </AlertDialogDescription>
        <div className="flex justify-end gap-3 mt-6">
          <AlertDialogClose className="cursor-pointer">
            <Button variant="secondary">Cancel</Button>
          </AlertDialogClose>
          <AlertDialogClose
            disabled={isPending}
            onClick={onDelete}
            className="cursor-pointer"
          >
            <Button variant="destructive" disabled={isPending}>
              {isPending ? (
                <LoaderCircle className="mr-1.5 size-4 animate-spin" />
              ) : null}
              Delete
            </Button>
          </AlertDialogClose>
        </div>
      </AlertDialogPopup>
    </AlertDialog>
  );
}
