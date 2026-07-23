import {
  AlertTriangle,
  BadgeCheck,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartner,
} from "@/types/service-partner";

interface ServicePartnerRiskCardProps {
  readonly partner: ServicePartner;
  readonly className?: string;
}

export function ServicePartnerRiskCard({
  className,
  partner,
}: ServicePartnerRiskCardProps): React.JSX.Element {
  const riskScore =
    partner.verification.riskScore;

  const riskLevel =
    riskScore >= 75
      ? "critical"
      : riskScore >= 50
        ? "high"
        : riskScore >= 25
          ? "moderate"
          : "low";

  const disputeRisk =
    partner.performance.disputeCount >
    5;

  const qualityRisk =
    partner.performance.qualityScore <
    70;

  const resolutionRisk =
    partner.performance
      .resolutionSuccessRate < 80;

  const restricted =
    partner.status ===
      "suspended" ||
    partner.status ===
      "rejected";

  const alerts = [
    disputeRisk
      ? "Dispute volume is above the preferred threshold."
      : null,
    qualityRisk
      ? "Verified quality score is below the preferred threshold."
      : null,
    resolutionRisk
      ? "Resolution success rate is below 80%."
      : null,
    restricted
      ? "Partner status currently restricts normal assignment activity."
      : null,
  ].filter(
    (alert): alert is string =>
      Boolean(alert)
  );

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border bg-card shadow-[var(--shadow-card)]",
        riskLevel === "critical" ||
          riskLevel === "high"
          ? "border-[color:rgb(145_59_59_/_0.4)]"
          : "border-border",
        className
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="flex items-center gap-3">
          <ShieldAlert
            aria-hidden="true"
            className="size-5 text-[var(--color-gold-600)]"
          />

          <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Risk Assessment
          </h2>
        </div>

        <Badge
          variant={
            riskLevel === "critical" ||
            riskLevel === "high"
              ? "error"
              : riskLevel ===
                  "moderate"
                ? "warning"
                : "success"
          }
        >
          {riskLevel.toUpperCase()}
        </Badge>
      </header>

      <div className="grid gap-5 p-6">
        <div
          className={cn(
            "rounded-[var(--radius-lg)] border p-5",
            riskLevel === "critical" ||
              riskLevel === "high"
              ? "border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.06)]"
              : riskLevel ===
                  "moderate"
                ? "border-[color:rgb(173_118_38_/_0.3)] bg-[color:rgb(173_118_38_/_0.06)]"
                : "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.06)]"
          )}
        >
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Verified Risk Score
          </p>

          <p className="mt-2 font-heading text-5xl font-medium tracking-[-0.045em] text-foreground">
            {riskScore}
            <span className="ml-1 text-lg text-muted">
              /100
            </span>
          </p>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-border">
            <div
              className={cn(
                "h-full rounded-full",
                riskLevel === "critical" ||
                  riskLevel === "high"
                  ? "bg-[var(--color-error)]"
                  : riskLevel ===
                      "moderate"
                    ? "bg-[var(--color-warning)]"
                    : "bg-[var(--color-success)]"
              )}
              style={{
                width: `${riskScore}%`,
              }}
            />
          </div>
        </div>

        {alerts.length > 0 ? (
          <div className="grid gap-3">
            {alerts.map((alert) => (
              <div
                key={alert}
                className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:rgb(145_59_59_/_0.28)] bg-[color:rgb(145_59_59_/_0.05)] p-4"
              >
                <AlertTriangle
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-[var(--color-error)]"
                />

                <p className="text-sm leading-6 text-muted">
                  {alert}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:rgb(62_107_82_/_0.28)] bg-[color:rgb(62_107_82_/_0.05)] p-4">
            <BadgeCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[var(--color-success)]"
            />

            <p className="text-sm leading-6 text-muted">
              No elevated operational,
              quality or dispute risks
              were detected.
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 border-t border-border pt-5 text-xs text-muted">
          <ShieldCheck
            aria-hidden="true"
            className="size-4 text-[var(--color-gold-600)]"
          />
          Risk signals should be
          reviewed alongside current
          verification evidence.
        </div>
      </div>
    </section>
  );
}
