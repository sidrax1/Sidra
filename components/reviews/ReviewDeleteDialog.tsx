"use client";

import {
  ShieldAlert,
  Trash2,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import type { ProductReview } from "@/types/review";

interface ReviewDeleteDialogProps {
  readonly open: boolean;
  readonly review: ProductReview | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onConfirm: (
    reviewId: string
  ) => void | Promise<void>;
}

export function ReviewDeleteDialog({
  loading = false,
  onConfirm,
  onOpenChange,
  open,
  review,
}: ReviewDeleteDialogProps): React.JSX.Element {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Delete Review
          </DialogTitle>

          <DialogDescription>
            Remove this review from your account and public product
            surfaces.
          </DialogDescription>
        </DialogHeader>

        <Alert
          variant="warning"
          title="Deletion cannot be undone"
          description="Helpful votes, media associations and the public review record will be removed through the secure review service."
          icon={
            <ShieldAlert
              aria-hidden={true}
              className="size-5"
            />
          }
        />

        {review ? (
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-5">
            <h3 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
              {review.title}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
              {review.review}
            </p>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Keep Review
          </Button>

          <Button
            variant="danger"
            disabled={!review}
            loading={loading}
            loadingLabel="Deleting Review"
            onClick={() => {
              if (review) {
                void onConfirm(
                  review.id
                );
              }
            }}
          >
            <Trash2
              aria-hidden={true}
              className="size-4"
            />
            Delete Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
