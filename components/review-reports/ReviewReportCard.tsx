"use client";

import {
  ArrowUpRight,
  CalendarDays,
  Flag,
  MoreVertical,
  ShieldAlert,
  UserRound,
} from "lucide-react";

import { ReviewReportReasonBadge } from "@/components/review-reports/ReviewReportReasonBadge";
import { ReviewReportStatusBadge } from "@/components/review-reports/ReviewReportStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { IconButton } from "@/components/ui/IconButton";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type {
  ReviewReport,
} from "@/types/review-report";

interface ReviewReportCardProps {
  readonly report: ReviewReport;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onOpen: (
    report: ReviewReport
  ) => void;
  readonly onAssign?: (
    report: ReviewReport
  ) => void;
  readonly onEscalate?: (
    report: ReviewReport
  ) => void;
  readonly onResolve?: (
    report: ReviewReport
  ) => void;
}

export function ReviewReportCard({
  className,
  loading = false,
  onAssign,
  onEscalate,
  onOpen,
  onResolve,
  report,
}: ReviewReportCardProps): React.JSX.Element {
  const highRisk = report.riskScore >= 70;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-[transform,border-color,box-shadow]",
        "hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.4)]",
        "hover:shadow-[var(--shadow-hover)]",
        highRisk &&
          "border-[color:rgb(145_59_59_/_0.36)]",
        className
      )}
    >
      <header className="flex items-start justify-between gap-5 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="min-w-0">
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

          <h2 className="mt-4 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Report #{report.reportNumber}
          </h2>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              label="Report actions"
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
            <DropdownMenuItem
              onSelect={() =>
                onOpen(report)
              }
            >
              Open report
            </DropdownMenuItem>

            {onAssign ? (
              <DropdownMenuItem
                onSelect={() =>
                  onAssign(report)
                }
              >
                Assign reviewer
              </DropdownMenuItem>
            ) : null}

            {onEscalate &&
            report.status !== "escalated" ? (
              <DropdownMenuItem
                onSelect={() =>
                  onEscalate(report)
                }
              >
                Escalate report
              </DropdownMenuItem>
            ) : null}

            {onResolve &&
            report.status !== "resolved" &&
            report.status !== "dismissed" ? (
              <DropdownMenuItem
                onSelect={() =>
                  onResolve(report)
                }
              >
                Resolve report
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="grid gap-5 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-600)]">
            Reported Review
          </p>

          <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            {report.review.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">
            {report.review.comment}
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Reporter Statement
          </p>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-foreground">
            {report.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <UserRound
              aria-hidden={true}
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            {report.reporter.reporterName}
          </span>

          <span className="inline-flex items-center gap-2">
            <CalendarDays
              aria-hidden={true}
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            {formatDateTime(report.createdAt)}
          </span>

          <span className="inline-flex items-center gap-2">
            <Flag
              aria-hidden={true}
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            {report.reportCountAtSubmission.toLocaleString(
              "en-IN"
            )}{" "}
            total reports
          </span>
        </div>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            variant="outline"
            onClick={() => onOpen(report)}
          >
            Review Report
            <ArrowUpRight
              aria-hidden={true}
              className="size-4"
            />
          </Button>
        </div>
      </div>
    </Card>
  );
}
