import {
  CalendarDays,
  Flag,
  ShieldAlert,
  UserRound,
} from "lucide-react";

import { ReviewReportReasonBadge } from "@/components/review-reports/ReviewReportReasonBadge";
import { ReviewReportStatusBadge } from "@/components/review-reports/ReviewReportStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type {
  ReviewReport,
} from "@/types/review-report";

interface ReviewReportDetailHeaderProps {
  readonly report: ReviewReport;
  readonly className?: string;
}

export function ReviewReportDetailHeader({
  className,
  report,
}: ReviewReportDetailHeaderProps): React.JSX.Element {
  const highRisk = report.riskScore >= 70;

  return (
    <header
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border",
        highRisk
          ? "border-[color:rgb(145_59_59_/_0.42)]"
          : "border-[color:rgb(200_169_106_/_0.3)]",
        "bg-card shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <div className="relative overflow-hidden bg-[var(--color-black-900)] px-6 py-10 text-white md:px-10">
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0"
          style={{
            background: highRisk
              ? "radial-gradient(circle at 84% 12%, rgba(145,59,59,0.35), transparent 42%)"
              : "radial-gradient(circle at 84% 12%, rgba(200,169,106,0.32), transparent 42%)",
          }}
        />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <ReviewReportStatusBadge
                status={report.status}
              />

              <ReviewReportReasonBadge
                reason={report.reason}
              />

              <Badge
                variant={
                  highRisk
                    ? "error"
                    : report.riskScore >= 40
                      ? "warning"
                      : "neutral"
                }
              >
                <ShieldAlert
                  aria-hidden={true}
                  className="mr-1 size-3.5"
                />
                Risk {report.riskScore}
              </Badge>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-500)]">
              Review Safety Report
            </p>

            <h1 className="mt-3 font-heading text-[clamp(2.8rem,6vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.055em]">
              #{report.reportNumber}
            </h1>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <UserRound
                  aria-hidden={true}
                  className="size-4"
                />
                {report.reporter.reporterName}
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarDays
                  aria-hidden={true}
                  className="size-4"
                />
                {formatDateTime(report.createdAt)}
              </span>

              <span className="inline-flex items-center gap-2">
                <Flag
                  aria-hidden={true}
                  className="size-4"
                />
                {report.reportCountAtSubmission.toLocaleString(
                  "en-IN"
                )}{" "}
                reports at submission
              </span>
            </div>
          </div>

          <div className="min-w-[240px] rounded-[var(--radius-lg)] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.16em] text-white/55">
              Report Status
            </p>

            <p className="mt-3 font-heading text-3xl font-medium tracking-[-0.03em] capitalize">
              {report.status.replace(
                /([A-Z])/g,
                " $1"
              )}
            </p>

            {report.assignment ? (
              <p className="mt-3 text-xs leading-5 text-white/60">
                Assigned reviewer:{" "}
                {report.assignment.assignedTo}
              </p>
            ) : (
              <p className="mt-3 text-xs leading-5 text-white/60">
                Awaiting reviewer assignment
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
