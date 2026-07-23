"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  Eye,
  EyeOff,
  Flag,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  type ModeratedReview,
} from "@/components/reviews/ReviewModerationCard";
import {
  ReviewModerationStatusBadge,
  type ReviewModerationStatus,
} from "@/components/reviews/ReviewModerationStatusBadge";
import {
  ReviewRatingBadge,
} from "@/components/reviews/ReviewRatingBadge";
import {
  Alert,
} from "@/components/ui/Alert";
import {
  Avatar,
} from "@/components/ui/Avatar";
import {
  Button,
} from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  FormField,
} from "@/components/ui/FormField";
import {
  Select,
} from "@/components/ui/Select";
import {
  Textarea,
} from "@/components/ui/Textarea";

export interface ReviewModerationDecision {
  readonly reviewId: string;
  readonly status: ReviewModerationStatus;
  readonly reason: string;
  readonly notifyCustomer: boolean;
  readonly notifyStudio: boolean;
}

interface ReviewModerationDialogProps {
  readonly open: boolean;
  readonly review: ModeratedReview | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    decision: ReviewModerationDecision
  ) => void | Promise<void>;
}

const statusOptions = [
  {
    value: "published",
    label: "Publish Review",
  },
  {
    value: "underReview",
    label: "Keep Under Review",
  },
  {
    value: "hidden",
    label: "Hide Review",
  },
  {
    value: "rejected",
    label: "Reject Review",
  },
] as const;

export function ReviewModerationDialog({
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  review,
}: ReviewModerationDialogProps): React.JSX.Element {
  const [
    status,
    setStatus,
  ] =
    useState<ReviewModerationStatus>(
      "underReview"
    );

  const [reason, setReason] =
    useState("");

  const [
    notifyCustomer,
    setNotifyCustomer,
  ] = useState(true);

  const [
    notifyStudio,
    setNotifyStudio,
  ] = useState(true);

  useEffect(() => {
    if (
      !open ||
      !review
    ) {
      return;
    }

    setStatus(
      review.moderationStatus ===
        "pending" ||
        review.moderationStatus ===
          "flagged"
        ? "underReview"
        : review.moderationStatus
    );

    setReason(
      review.moderationReason ??
        ""
    );

    setNotifyCustomer(true);
    setNotifyStudio(true);
  }, [
    open,
    review,
  ]);

  const reasonRequired =
    status === "hidden" ||
    status === "rejected" ||
    status ===
      "underReview";

  const valid =
    Boolean(review) &&
    (!reasonRequired ||
      reason.trim().length >=
        10);

  const StatusIcon =
    status === "published"
      ? Eye
      : status === "hidden"
        ? EyeOff
        : status ===
            "rejected"
          ? XCircle
          : ShieldCheck;

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Review Moderation
          </DialogTitle>

          <DialogDescription>
            Evaluate the customer review against marketplace content
            standards and publish a recorded decision.
          </DialogDescription>
        </DialogHeader>

        {review ? (
          <div className="grid gap-6">
            <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <div className="flex items-start gap-4">
                <Avatar
                  name={
                    review.customerName
                  }
                  src={
                    review.customerPhotoURL
                  }
                  size="md"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-medium text-foreground">
                      {
                        review.customerName
                      }
                    </h3>

                    <ReviewRatingBadge
                      rating={
                        review.rating
                      }
                    />

                    <ReviewModerationStatusBadge
                      status={
                        review.moderationStatus
                      }
                    />
                  </div>

                  <h4 className="mt-4 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                    {review.title}
                  </h4>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">
                    {review.comment}
                  </p>
                </div>
              </div>
            </section>

            {review.reportCount >
            0 ? (
              <Alert
                variant="warning"
                title={`${review.reportCount.toLocaleString(
                  "en-IN"
                )} customer ${
                  review.reportCount ===
                  1
                    ? "report"
                    : "reports"
                }`}
                description="Review reported content and supporting evidence before publishing a decision."
                icon={
                  <Flag
                    aria-hidden="true"
                    className="size-5"
                  />
                }
              />
            ) : null}

            <FormField
              label="Moderation Decision"
              labelFor="review-moderation-status"
              required
            >
              <Select
                id="review-moderation-status"
                value={status}
                options={
                  statusOptions
                }
                disabled={loading}
                onChange={(event) =>
                  setStatus(
                    event.target
                      .value as ReviewModerationStatus
                  )
                }
              />
            </FormField>

            <FormField
              label="Moderation Reason"
              labelFor="review-moderation-reason"
              required={
                reasonRequired
              }
              optional={
                !reasonRequired
              }
              description={`${reason.length}/2000 characters`}
            >
              <Textarea
                id="review-moderation-reason"
                value={reason}
                rows={7}
                minLength={
                  reasonRequired
                    ? 10
                    : undefined
                }
                maxLength={2000}
                disabled={loading}
                placeholder="Document the policy basis and relevant review findings."
                onChange={(event) =>
                  setReason(
                    event.target
                      .value
                  )
                }
              />
            </FormField>

            <div className="grid gap-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
                <input
                  type="checkbox"
                  checked={
                    notifyCustomer
                  }
                  disabled={loading}
                  onChange={(
                    event
                  ) =>
                    setNotifyCustomer(
                      event.target
                        .checked
                    )
                  }
                  className="mt-1 size-4 accent-[var(--color-gold-500)]"
                />

                <span>
                  <span className="block text-sm font-medium text-foreground">
                    Notify customer
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-muted">
                    Send the moderation outcome to the review author.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
                <input
                  type="checkbox"
                  checked={
                    notifyStudio
                  }
                  disabled={loading}
                  onChange={(
                    event
                  ) =>
                    setNotifyStudio(
                      event.target
                        .checked
                    )
                  }
                  className="mt-1 size-4 accent-[var(--color-gold-500)]"
                />

                <span>
                  <span className="block text-sm font-medium text-foreground">
                    Notify Studio
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-muted">
                    Send the outcome to the associated Studio account.
                  </span>
                </span>
              </label>
            </div>
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
            Cancel
          </Button>

          <Button
            disabled={!valid}
            loading={loading}
            loadingLabel="Publishing Decision"
            onClick={() => {
              if (!review) {
                return;
              }

              void onSubmit({
                reviewId:
                  review.id,
                status,
                reason:
                  reason.trim(),
                notifyCustomer,
                notifyStudio,
              });
            }}
          >
            <StatusIcon
              aria-hidden="true"
              className="size-4"
            />
            Publish Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
