"use client";

import {
  CheckCircle2,
  Eye,
  FileQuestion,
  RotateCcw,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface ServicePartnerApplicationActionsProps {
  readonly application: ServicePartnerApplication;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onOpen?: (
    application: ServicePartnerApplication
  ) => void;
  readonly onApprove?: (
    application: ServicePartnerApplication
  ) => void;
  readonly onRequestInformation?: (
    application: ServicePartnerApplication
  ) => void;
  readonly onReject?: (
    application: ServicePartnerApplication
  ) => void;
  readonly onReopen?: (
    application: ServicePartnerApplication
  ) => void;
}

export function ServicePartnerApplicationActions({
  application,
  className,
  loading = false,
  onApprove,
  onOpen,
  onReject,
  onReopen,
  onRequestInformation,
}: ServicePartnerApplicationActionsProps): React.JSX.Element {
  const reviewable = [
    "submitted",
    "underReview",
    "additionalInformationRequired",
  ].includes(application.status);

  const reopenable =
    application.status ===
      "rejected" ||
    application.status ===
      "withdrawn";

  return (
    <section
      aria-label="Service partner application actions"
      className={cn(
        "rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[var(--color-gold-600)]">
          Verification Operations
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Application Actions
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Review decisions are validated by protected server-side
          functions and recorded in the permanent audit trail.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {onOpen ? (
          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              onOpen(application)
            }
          >
            <Eye
              aria-hidden={true}
              className="size-4"
            />
            View Application
          </Button>
        ) : null}

        {reviewable &&
        onApprove ? (
          <Button
            disabled={loading}
            onClick={() =>
              onApprove(
                application
              )
            }
          >
            <CheckCircle2
              aria-hidden={true}
              className="size-4"
            />
            Approve Partner
          </Button>
        ) : null}

        {reviewable &&
        onRequestInformation ? (
          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              onRequestInformation(
                application
              )
            }
          >
            <FileQuestion
              aria-hidden={true}
              className="size-4"
            />
            Request Information
          </Button>
        ) : null}

        {reviewable &&
        onReject ? (
          <Button
            variant="danger"
            disabled={loading}
            onClick={() =>
              onReject(
                application
              )
            }
          >
            <XCircle
              aria-hidden={true}
              className="size-4"
            />
            Reject Application
          </Button>
        ) : null}

        {reopenable &&
        onReopen ? (
          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              onReopen(
                application
              )
            }
          >
            <RotateCcw
              aria-hidden={true}
              className="size-4"
            />
            Reopen Review
          </Button>
        ) : null}
      </div>

      {!reviewable &&
      !reopenable ? (
        <div className="mt-6 flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:rgb(62_107_82_/_0.28)] bg-[color:rgb(62_107_82_/_0.05)] p-4">
          <ShieldAlert
            aria-hidden={true}
            className="mt-0.5 size-4 shrink-0 text-[var(--color-success)]"
          />

          <p className="text-sm leading-6 text-muted">
            This application has completed the active review workflow.
            Additional changes require an authorised administrative
            process.
          </p>
        </div>
      ) : null}
    </section>
  );
}
