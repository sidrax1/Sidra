import {
  FileSearch,
  Hash,
  ShieldCheck,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentSourceCardProps {
  readonly assignment: ServicePartnerAssignment;
  readonly className?: string;
}

const sourceLabels: Record<
  ServicePartnerAssignment["sourceType"],
  string
> = {
  warrantyClaim:
    "Warranty Claim",
  returnInspection:
    "Return Inspection",
  disputeInspection:
    "Dispute Inspection",
  repairRequest:
    "Repair Request",
  qualityAudit:
    "Quality Audit",
};

export function ServicePartnerAssignmentSourceCard({
  assignment,
  className,
}: ServicePartnerAssignmentSourceCardProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-5">
        <span className="flex size-12 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
          <FileSearch
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <Badge variant="gold">
          {
            sourceLabels[
              assignment.sourceType
            ]
          }
        </Badge>
      </div>

      <h2 className="mt-5 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
        Assignment Source
      </h2>

      <dl className="mt-6 grid gap-4 border-t border-border pt-5">
        <div className="flex items-start justify-between gap-5">
          <dt className="inline-flex items-center gap-2 text-sm text-muted">
            <Hash
              aria-hidden={true}
              className="size-4 text-[var(--color-gold-600)]"
            />
            Source ID
          </dt>

          <dd className="max-w-[65%] break-all text-right font-mono text-xs font-medium text-foreground">
            {
              assignment.sourceId
            }
          </dd>
        </div>

        <div className="flex items-start justify-between gap-5">
          <dt className="text-sm text-muted">
            Studio ID
          </dt>

          <dd className="max-w-[65%] break-all text-right font-mono text-xs font-medium text-foreground">
            {
              assignment.studioId
            }
          </dd>
        </div>

        <div className="flex items-start justify-between gap-5">
          <dt className="text-sm text-muted">
            Customer ID
          </dt>

          <dd className="max-w-[65%] break-all text-right font-mono text-xs font-medium text-foreground">
            {
              assignment.customerId
            }
          </dd>
        </div>

        <div className="flex items-center justify-between gap-5">
          <dt className="inline-flex items-center gap-2 text-sm text-muted">
            <ShieldCheck
              aria-hidden={true}
              className="size-4 text-[var(--color-success)]"
            />
            Required Capability
          </dt>

          <dd className="text-right text-sm font-medium capitalize text-foreground">
            {assignment.capability.replace(
              /([A-Z])/g,
              " $1"
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}
