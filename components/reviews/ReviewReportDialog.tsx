"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  Flag,
  ShieldAlert,
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
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type {
  ReportReviewInput,
} from "@/lib/schemas/review";
import type { ProductReview } from "@/types/review";

interface ReviewReportDialogProps {
  readonly open: boolean;
  readonly review: ProductReview | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: ReportReviewInput
  ) => void | Promise<void>;
}

const reasonOptions = [
  {
    value: "spam",
    label: "Spam or Promotional Content",
  },
  {
    value: "abusive",
    label: "Abusive or Harassing Content",
  },
  {
    value: "irrelevant",
    label: "Unrelated to the Product",
  },
  {
    value: "personalInformation",
    label: "Contains Personal Information",
  },
  {
    value: "fraudulent",
    label: "Potentially Fraudulent",
  },
  {
    value: "other",
    label: "Other Concern",
  },
] as const;

type ReportReason =
  ReportReviewInput["reason"];

export function ReviewReportDialog({
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  review,
}: ReviewReportDialogProps): React.JSX.Element {
  const [reason, setReason] =
    useState<ReportReason>("spam");

  const [
    explanation,
    setExplanation,
  ] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setReason("spam");
    setExplanation("");
  }, [open, review?.id]);

  const explanationRequired =
    reason === "other";

  const valid =
    review !== null &&
    (!explanationRequired ||
      explanation.trim().length >= 10);

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Report Review
          </DialogTitle>

          <DialogDescription>
            Share a genuine policy concern for secure moderation
            review. Reports do not automatically remove content.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <Alert
            variant="warning"
            title="Reports are reviewed by authorised staff"
            description="False or abusive reporting may be recorded against the reporting account."
            icon={
              <ShieldAlert
                aria-hidden={true}
                className="size-5"
              />
            }
          />

          <FormField
            label="Reason"
            labelFor="review-report-reason"
            required
          >
            <Select
              id="review-report-reason"
              value={reason}
              options={reasonOptions}
              disabled={loading}
              onChange={(event) =>
                setReason(
                  event.target
                    .value as ReportReason
                )
              }
            />
          </FormField>

          <FormField
            label="Additional Context"
            labelFor="review-report-explanation"
            required={
              explanationRequired
            }
            optional={
              !explanationRequired
            }
            description={`${explanation.length}/1000 characters`}
          >
            <Textarea
              id="review-report-explanation"
              value={explanation}
              rows={6}
              disabled={loading}
              maxLength={1000}
              onChange={(event) =>
                setExplanation(
                  event.target.value
                )
              }
            />
          </FormField>
        </div>

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
            variant="danger"
            disabled={!valid}
            loading={loading}
            loadingLabel="Submitting Report"
            onClick={() => {
              if (!review) {
                return;
              }

              void onSubmit({
                reviewId: review.id,
                reason,
                explanation:
                  explanation.trim() ||
                  undefined,
              });
            }}
          >
            <Flag
              aria-hidden={true}
              className="size-4"
            />
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
