import {
  BadgeCheck,
  CalendarX2,
  FileCheck2,
  FileWarning,
  ShieldAlert,
} from "lucide-react";

import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerDocument,
} from "@/types/service-partner";

interface ServicePartnerDocumentSummaryProps {
  readonly documents: readonly ServicePartnerDocument[];
  readonly className?: string;
}

export function ServicePartnerDocumentSummary({
  className,
  documents,
}: ServicePartnerDocumentSummaryProps): React.JSX.Element {
  const now = Date.now();

  const verified = documents.filter(
    (document) => document.verified
  ).length;

  const rejected = documents.filter(
    (document) =>
      Boolean(
        document.rejectionReason
      )
  ).length;

  const expired = documents.filter(
    (document) =>
      Boolean(document.expiresAt) &&
      new Date(
        document.expiresAt ?? ""
      ).getTime() < now
  ).length;

  const pending =
    documents.length -
    verified -
    rejected;

  const metrics = [
    {
      label: "Total Documents",
      value: documents.length,
      icon: FileCheck2,
      tone: "neutral",
    },
    {
      label: "Verified",
      value: verified,
      icon: BadgeCheck,
      tone: "success",
    },
    {
      label: "Pending Review",
      value: Math.max(
        pending,
        0
      ),
      icon: FileWarning,
      tone: "warning",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: ShieldAlert,
      tone: "error",
    },
    {
      label: "Expired",
      value: expired,
      icon: CalendarX2,
      tone: "error",
    },
  ] as const;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Compliance Documents
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Document Summary
        </h2>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className={cn(
                "rounded-[var(--radius-lg)] border p-5",
                metric.tone ===
                  "success"
                  ? "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.06)]"
                  : metric.tone ===
                      "warning"
                    ? "border-[color:rgb(173_118_38_/_0.3)] bg-[color:rgb(173_118_38_/_0.06)]"
                    : metric.tone ===
                        "error"
                      ? "border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.06)]"
                      : "border-border bg-background"
              )}
            >
              <Icon
                aria-hidden={true}
                className={cn(
                  "size-5",
                  metric.tone ===
                    "success"
                    ? "text-[var(--color-success)]"
                    : metric.tone ===
                        "warning"
                      ? "text-[var(--color-warning)]"
                      : metric.tone ===
                          "error"
                        ? "text-[var(--color-error)]"
                        : "text-[var(--color-gold-600)]"
                )}
              />

              <p className="mt-4 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
                {metric.value.toLocaleString(
                  "en-IN"
                )}
              </p>

              <p className="mt-2 text-xs text-muted">
                {metric.label}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
