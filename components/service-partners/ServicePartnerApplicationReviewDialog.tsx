"use client";

import {
  CheckCircle2,
  FileQuestion,
  Gavel,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
} from "@/components/ui/Alert";
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
  Input,
} from "@/components/ui/Input";
import {
  Textarea,
} from "@/components/ui/Textarea";
import type {
  ReviewServicePartnerApplicationInput,
} from "@/lib/schemas/service-partner";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

type ApplicationDecision =
  | "approve"
  | "requestInformation"
  | "reject";

interface ServicePartnerApplicationReviewDialogProps {
  readonly open: boolean;
  readonly application: ServicePartnerApplication | null;
  readonly decision: ApplicationDecision;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: ReviewServicePartnerApplicationInput
  ) => void | Promise<void>;
}

const decisionTitles: Record<
  ApplicationDecision,
  string
> = {
  approve:
    "Approve Service Partner",
  requestInformation:
    "Request Additional Information",
  reject:
    "Reject Service Partner",
};

const decisionDescriptions: Record<
  ApplicationDecision,
  string
> = {
  approve:
    "Approve the application and create a verified service partner profile.",
  requestInformation:
    "Return the application to the applicant with clear verification requirements.",
  reject:
    "Reject the application and record a permanent review reason.",
};

export function ServicePartnerApplicationReviewDialog({
  application,
  decision,
  loading = false,
  onOpenChange,
  onSubmit,
  open,
}: ServicePartnerApplicationReviewDialogProps): React.JSX.Element {
  const [
    reviewerNote,
    setReviewerNote,
  ] = useState("");

  const [
    riskScore,
    setRiskScore,
  ] = useState(0);

  useEffect(() => {
    if (!open) {
      return;
    }

    setReviewerNote(
      application?.reviewerNote ??
        ""
    );

    setRiskScore(0);
  }, [
    application,
    decision,
    open,
  ]);

  const reviewable =
    application
      ? [
          "submitted",
          "underReview",
          "additionalInformationRequired",
        ].includes(
          application.status
        )
      : false;

  const valid =
    Boolean(application) &&
    reviewable &&
    reviewerNote.trim()
      .length >= 20 &&
    Number.isInteger(
      riskScore
    ) &&
    riskScore >= 0 &&
    riskScore <= 100;

  const AlertIcon =
    decision === "approve"
      ? CheckCircle2
      : decision ===
          "requestInformation"
        ? FileQuestion
        : ShieldAlert;

  const alertVariant =
    decision === "approve"
      ? "success"
      : decision ===
          "requestInformation"
        ? "warning"
        : "error";

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[94vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {
              decisionTitles[
                decision
              ]
            }
          </DialogTitle>

          <DialogDescription>
            {
              decisionDescriptions[
                decision
              ]
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant={
              alertVariant
            }
            title={
              decision ===
              "approve"
                ? "Approval activates onboarding"
                : decision ===
                    "requestInformation"
                  ? "The applicant must respond before approval"
                  : "Rejection closes this application"
            }
            description={
              decision ===
              "approve"
                ? "A service partner profile may be created after server-side verification succeeds."
                : decision ===
                    "requestInformation"
                  ? "List every missing, unclear or expired document in the reviewer note."
                  : "Provide a clear compliance, risk or capability reason for rejection."
            }
            icon={
              <AlertIcon
                aria-hidden={true}
                className="size-5"
              />
            }
          />

          {application ? (
            <section className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <div>
                <p className="font-mono text-xs text-muted">
                  Application #
                  {
                    application.applicationNumber
                  }
                </p>

                <h3 className="mt-2 font-heading text-3xl font-medium tracking-[-0.035em] text-foreground">
                  {
                    application.displayName
                  }
                </h3>

                <p className="mt-1 text-sm text-muted">
                  {
                    application.legalName
                  }
                </p>
              </div>

              <dl className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                    Capabilities
                  </dt>

                  <dd className="mt-2 font-heading text-2xl font-medium text-foreground">
                    {
                      application.capabilities
                        .length
                    }
                  </dd>
                </div>

                <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                    Coverage States
                  </dt>

                  <dd className="mt-2 font-heading text-2xl font-medium text-foreground">
                    {
                      application.coverageStates
                        .length
                    }
                  </dd>
                </div>

                <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                    Documents
                  </dt>

                  <dd className="mt-2 font-heading text-2xl font-medium text-foreground">
                    {
                      application.documentPaths
                        .length
                    }
                  </dd>
                </div>
              </dl>
            </section>
          ) : null}

          <FormField
            label="Risk Score"
            labelFor="service-partner-risk-score"
            required
            description="0 represents the lowest assessed risk and 100 represents the highest."
          >
            <Input
              id="service-partner-risk-score"
              type="number"
              min={0}
              max={100}
              step={1}
              value={riskScore}
              disabled={loading}
              onChange={(event) =>
                setRiskScore(
                  Math.min(
                    Math.max(
                      Number(
                        event.target
                          .value
                      ) || 0,
                      0
                    ),
                    100
                  )
                )
              }
            />
          </FormField>

          <FormField
            label="Reviewer Note"
            labelFor="service-partner-review-note"
            required
            description={`${reviewerNote.length}/3000 characters`}
          >
            <Textarea
              id="service-partner-review-note"
              value={reviewerNote}
              rows={10}
              minLength={20}
              maxLength={3000}
              disabled={loading}
              placeholder={
                decision ===
                "approve"
                  ? "Document verification results, service capability, operating readiness and approval conditions."
                  : decision ===
                      "requestInformation"
                    ? "List every missing document, clarification or corrective action required from the applicant."
                    : "Document the compliance, risk, identity, capability or service-quality basis for rejection."
              }
              onChange={(event) =>
                setReviewerNote(
                  event.target
                    .value
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
            variant={
              decision ===
              "reject"
                ? "danger"
                : "default"
            }
            disabled={!valid}
            loading={loading}
            loadingLabel={
              decision ===
              "approve"
                ? "Approving Partner"
                : decision ===
                    "requestInformation"
                  ? "Requesting Information"
                  : "Rejecting Application"
            }
            onClick={() => {
              if (!application) {
                return;
              }

              void onSubmit({
                applicationId:
                  application.id,
                decision,
                reviewerNote:
                  reviewerNote.trim(),
                riskScore,
              });
            }}
          >
            {decision ===
            "approve" ? (
              <Gavel
                aria-hidden={true}
                className="size-4"
              />
            ) : decision ===
              "requestInformation" ? (
              <FileQuestion
                aria-hidden={true}
                className="size-4"
              />
            ) : (
              <XCircle
                aria-hidden={true}
                className="size-4"
              />
            )}

            {
              decisionTitles[
                decision
              ]
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
