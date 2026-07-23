"use client";

import {
  Eye,
  EyeOff,
  Flag,
  MoreVertical,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  ReviewModerationStatusBadge,
  type ReviewModerationStatus,
} from "@/components/reviews/ReviewModerationStatusBadge";
import {
  ReviewRatingBadge,
} from "@/components/reviews/ReviewRatingBadge";
import {
  Avatar,
} from "@/components/ui/Avatar";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  Card,
} from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  IconButton,
} from "@/components/ui/IconButton";
import {
  formatDateTime,
} from "@/lib/date";
import type {
  Review,
} from "@/types/review";

export interface ModeratedReview
  extends Review {
  readonly moderationStatus: ReviewModerationStatus;
  readonly reportCount: number;
  readonly moderationReason?: string;
}

interface ReviewModerationCardProps {
  readonly review: ModeratedReview;
  readonly loading?: boolean;
  readonly onPublish?: (
    review: ModeratedReview
  ) => void;
  readonly onHide?: (
    review: ModeratedReview
  ) => void;
  readonly onReview?: (
    review: ModeratedReview
  ) => void;
  readonly onReject?: (
    review: ModeratedReview
  ) => void;
  readonly onDelete?: (
    review: ModeratedReview
  ) => void;
}

export function ReviewModerationCard({
  loading = false,
  onDelete,
  onHide,
  onPublish,
  onReject,
  onReview,
  review,
}: ReviewModerationCardProps): React.JSX.Element {
  return (
    <Card className="overflow-hidden">
      <header className="flex items-start justify-between gap-5 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="flex min-w-0 items-start gap-4">
          <Avatar
            name={
              review.customerName
            }
            src={
              review.customerPhotoURL
            }
            size="md"
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-medium text-foreground">
                {review.customerName}
              </h2>

              <ReviewModerationStatusBadge
                status={
                  review.moderationStatus
                }
              />

              <ReviewRatingBadge
                rating={
                  review.rating
                }
              />
            </div>

            <p className="mt-2 text-xs text-muted">
              Submitted{" "}
              {formatDateTime(
                review.createdAt
              )}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              label="Moderation actions"
              icon={
                <MoreVertical
                  aria-hidden={true}
                />
              }
              appearance="ghost"
              disabled={loading}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {review.moderationStatus !==
              "published" &&
            onPublish ? (
              <DropdownMenuItem
                onSelect={() =>
                  onPublish(
                    review
                  )
                }
              >
                <Eye
                  aria-hidden={true}
                  className="mr-2 size-4"
                />
                Publish review
              </DropdownMenuItem>
            ) : null}

            {review.moderationStatus !==
              "hidden" &&
            onHide ? (
              <DropdownMenuItem
                onSelect={() =>
                  onHide(review)
                }
              >
                <EyeOff
                  aria-hidden={true}
                  className="mr-2 size-4"
                />
                Hide review
              </DropdownMenuItem>
            ) : null}

            {onReview ? (
              <DropdownMenuItem
                onSelect={() =>
                  onReview(
                    review
                  )
                }
              >
                <ShieldCheck
                  aria-hidden={true}
                  className="mr-2 size-4"
                />
                Open moderation
              </DropdownMenuItem>
            ) : null}

            {onReject ? (
              <DropdownMenuItem
                destructive
                onSelect={() =>
                  onReject(
                    review
                  )
                }
              >
                <Flag
                  aria-hidden={true}
                  className="mr-2 size-4"
                />
                Reject review
              </DropdownMenuItem>
            ) : null}

            {onDelete ? (
              <DropdownMenuItem
                destructive
                onSelect={() =>
                  onDelete(
                    review
                  )
                }
              >
                <Trash2
                  aria-hidden={true}
                  className="mr-2 size-4"
                />
                Delete review
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="grid gap-5 p-5">
        <div>
          <h3 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            {review.title}
          </h3>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">
            {review.comment}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {review.verifiedPurchase ? (
            <Badge variant="success">
              <ShieldCheck
                aria-hidden={true}
                className="mr-1 size-3.5"
              />
              Verified Purchase
            </Badge>
          ) : (
            <Badge variant="warning">
              Unverified Purchase
            </Badge>
          )}

          {review.reportCount >
          0 ? (
            <Badge variant="error">
              <Flag
                aria-hidden={true}
                className="mr-1 size-3.5"
              />
              {review.reportCount.toLocaleString(
                "en-IN"
              )}{" "}
              reports
            </Badge>
          ) : null}
        </div>

        {review.moderationReason ? (
          <div className="rounded-[var(--radius-md)] border border-[color:rgb(145_59_59_/_0.28)] bg-[color:rgb(145_59_59_/_0.06)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-error)]">
              Moderation Note
            </p>

            <p className="mt-2 text-sm leading-6 text-muted">
              {
                review.moderationReason
              }
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
