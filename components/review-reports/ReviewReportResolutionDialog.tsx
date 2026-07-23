"use client";

import {
  Gavel,
  ShieldCheck,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

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
  ResolveReviewReportInput,
} from "@/lib/schemas/review-report";
import type {
  ReviewReport,
} from "@/types/review-report";

interface ReviewReportResolutionDialogProps {
  readonly open: boolean;
  readonly report: ReviewReport | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: ResolveReviewReportInput
  ) => void | Promise<void>;
}

type Resolution =
  ResolveReviewReportInput["resolution"];

const resolutionOptions = [
  {
    value: "reviewPublished",
    label: "Keep Review Published",
  },
  {
    value: "reviewHidden",
    label: "Hide Review",
  },
  {
    value: "reviewRejected",
    label: "Reject Review",
  },
  {
    value: "reviewDeleted",
    label: "Delete Review",
  },
  {
    value: "reportDismissed",
    label: "Dismiss Report",
  },
  {
    value: "accountRestricted",
    label: "Restrict Account",
  },
  {
    value: "escalatedToCompliance",
    label: "Escalate to Compliance",
  },
] as const;

export function ReviewReportResolutionDialog({
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  report,
}: ReviewReportResolutionDialogProps): React.JSX.Element {
  const [resolution, setResolution] =
    useState<Resolution>("reportDismissed");

  const [reason, setReason] = useState("");
  const [internalNote, setInternalNote] =
    useState("");
  const [notifyReporter, setNotifyReporter] =
    useState(true);
  const [
    notifyReviewAuthor,
    setNotifyReviewAuthor,
  ] = useState(true);
  const [notifyStudio, setNotifyStudio] =
    useState(true);

  useEffect(() => {
    if (!open) {
      return;
    }

    setResolution("reportDismissed");
    setReason("");
    setInternalNote("");
    setNotifyReporter(true);
    setNotifyReviewAuthor(true);
    setNotifyStudio(true);
  }, [open, report?.id]);

  const valid =
    Boolean(report) &&
    reason.trim().length >= 20;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Resolve Review Report
          </DialogTitle>

          <DialogDescription>
            Publish a final moderation outcome and preserve the
            decision in the compliance audit trail.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant="warning"
            title="Resolution may alter public review visibility"
            description="Verify the report evidence, review content and marketplace policy before confirming."
            icon={
              <Gavel
                aria-hidden={true}
                className="size-5"
              />
            }
          />

          {report ? (
            <div className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Report #{report.reportNumber}
              </p>

              <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                {report.review.title}
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
                {report.review.comment}
              </p>
            </div>
          ) : null}

          <FormField
            label="Resolution"
            labelFor="review-report-resolution"
            required
          >
            <Select
              id="review-report-resolution"
              value={resolution}
              options={resolutionOptions}
              disabled={loading}
              onChange={(event) =>
                setResolution(
                  event.target.value as Resolution
                )
              }
            />
          </FormField>

          <FormField
            label="Resolution Reason"
            labelFor="review-report-resolution-reason"
            required
            description={`${reason.length}/2500 characters`}
          >
            <Textarea
              id="review-report-resolution-reason"
              value={reason}
              rows={8}
              minLength={20}
              maxLength={2500}
              disabled={loading}
              onChange={(event) =>
                setReason(event.target.value)
              }
            />
          </FormField>

          <FormField
            label="Internal Note"
            labelFor="review-report-internal-note"
            optional
            description={`${internalNote.length}/2500 characters`}
          >
            <Textarea
              id="review-report-internal-note"
              value={internalNote}
              rows={6}
              maxLength={2500}
              disabled={loading}
              onChange={(event) =>
                setInternalNote(event.target.value)
              }
            />
          </FormField>

          <fieldset className="grid gap-3">
            <legend className="mb-1 text-sm font-medium text-foreground">
              Notifications
            </legend>

            <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
              <input
                type="checkbox"
                checked={notifyReporter}
                disabled={loading}
                onChange={(event) =>
                  setNotifyReporter(
                    event.target.checked
                  )
                }
                className="mt-1 size-4 accent-[var(--color-gold-500)]"
              />

              <span className="text-sm text-foreground">
                Notify reporter of the outcome
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
              <input
                type="checkbox"
                checked={notifyReviewAuthor}
                disabled={loading}
                onChange={(event) =>
                  setNotifyReviewAuthor(
                    event.target.checked
                  )
                }
                className="mt-1 size-4 accent-[var(--color-gold-500)]"
              />

              <span className="text-sm text-foreground">
                Notify review author
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
              <input
                type="checkbox"
                checked={notifyStudio}
                disabled={loading}
                onChange={(event) =>
                  setNotifyStudio(
                    event.target.checked
                  )
                }
                className="mt-1 size-4 accent-[var(--color-gold-500)]"
              />

              <span className="text-sm text-foreground">
                Notify associated Studio
              </span>
            </label>
          </fieldset>

          <p className="inline-flex items-start gap-3 border-t border-border pt-5 text-xs leading-6 text-muted">
            <ShieldCheck
              aria-hidden={true}
              className="mt-0.5 size-4 shrink-0 text-[var(--color-success)]"
            />
            Review changes, notifications and report resolution are
            executed atomically by trusted server-side functions.
          </p>
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
            disabled={!valid}
            loading={loading}
            loadingLabel="Resolving Report"
            onClick={() => {
              if (!report) {
                return;
              }

              void onSubmit({
                reportId: report.id,
                resolution,
                reason: reason.trim(),
                internalNote:
                  internalNote.trim() ||
                  undefined,
                notifyReporter,
                notifyReviewAuthor,
                notifyStudio,
              });
            }}
          >
            <Gavel
              aria-hidden={true}
              className="size-4"
            />
            Confirm Resolution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
