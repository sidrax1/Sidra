import type {
  ReactNode,
} from "react";

import { ReviewReportCard } from "@/components/review-reports/ReviewReportCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type {
  ReviewReport,
} from "@/types/review-report";

interface ReviewReportListProps {
  readonly reports: readonly ReviewReport[];
  readonly emptyAction?: ReactNode;
  readonly loadingReportIds?: ReadonlySet<string>;
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

export function ReviewReportList({
  emptyAction,
  loadingReportIds,
  onAssign,
  onEscalate,
  onOpen,
  onResolve,
  reports,
}: ReviewReportListProps): React.JSX.Element {
  if (reports.length === 0) {
    return (
      <EmptyState
        title="No review reports"
        description="Reported customer reviews and moderation escalations will appear here."
        action={emptyAction}
      />
    );
  }

  const orderedReports = [...reports].sort(
    (first, second) => {
      if (first.riskScore !== second.riskScore) {
        return second.riskScore - first.riskScore;
      }

      return second.createdAt.localeCompare(
        first.createdAt
      );
    }
  );

  return (
    <section
      aria-label="Review reports"
      className="grid gap-5 xl:grid-cols-2"
    >
      {orderedReports.map((report) => (
        <ReviewReportCard
          key={report.id}
          report={report}
          loading={
            loadingReportIds?.has(report.id) ??
            false
          }
          onOpen={onOpen}
          onAssign={onAssign}
          onEscalate={onEscalate}
          onResolve={onResolve}
        />
      ))}
    </section>
  );
}
