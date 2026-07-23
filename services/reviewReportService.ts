import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { db } from "@/firebase/client";
import { callableFunction } from "@/firebase/functions";
import type {
  AssignReviewReportInput,
  CreateReviewReportInput,
  MergeReviewReportsInput,
  ResolveReviewReportInput,
  UpdateReviewReportStatusInput,
} from "@/lib/schemas/review-report";
import type {
  ReviewReport,
  ReviewReportAnalytics,
  ReviewReportReason,
  ReviewReportStatus,
  ReviewReportTimelineEvent,
} from "@/types/review-report";

export interface ReviewReportPage {
  readonly reports: readonly ReviewReport[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

export interface ReviewReportFilters {
  readonly statuses?: readonly ReviewReportStatus[];
  readonly reasons?: readonly ReviewReportReason[];
  readonly reviewId?: string;
  readonly studioId?: string;
  readonly reporterId?: string;
  readonly assigneeId?: string;
  readonly minimumRiskScore?: number;
  readonly pageSize?: number;
  readonly cursor?:
    | QueryDocumentSnapshot<DocumentData>
    | null;
}

interface ReviewReportMutationResponse {
  readonly report: ReviewReport;
}

const createReportCallable = callableFunction<
  CreateReviewReportInput,
  ReviewReportMutationResponse
>("createReviewReport");

const assignReportCallable = callableFunction<
  AssignReviewReportInput,
  ReviewReportMutationResponse
>("assignReviewReport");

const updateReportStatusCallable = callableFunction<
  UpdateReviewReportStatusInput,
  ReviewReportMutationResponse
>("updateReviewReportStatus");

const resolveReportCallable = callableFunction<
  ResolveReviewReportInput,
  ReviewReportMutationResponse
>("resolveReviewReport");

const mergeReportsCallable = callableFunction<
  MergeReviewReportsInput,
  {
    readonly primaryReport: ReviewReport;
    readonly mergedReportIds: readonly string[];
  }
>("mergeReviewReports");

const getAnalyticsCallable = callableFunction<
  {
    readonly studioId?: string;
    readonly dateFrom?: string;
    readonly dateTo?: string;
  },
  ReviewReportAnalytics
>("getReviewReportAnalytics");

function assertIdentifier(
  value: string,
  label: string
): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export async function getReviewReport(
  reportId: string
): Promise<ReviewReport | null> {
  assertIdentifier(reportId, "Report ID");

  const snapshot = await getDoc(
    doc(db, "reviewReports", reportId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as ReviewReport;
}

export async function getReviewReportByNumber(
  reportNumber: string
): Promise<ReviewReport | null> {
  assertIdentifier(
    reportNumber,
    "Report number"
  );

  const snapshot = await getDocs(
    query(
      collection(db, "reviewReports"),
      where(
        "reportNumber",
        "==",
        reportNumber.trim()
      ),
      limit(1)
    )
  );

  const reportDocument = snapshot.docs.at(0);

  return reportDocument
    ? ({
        id: reportDocument.id,
        ...reportDocument.data(),
      } as ReviewReport)
    : null;
}

export async function getReviewReports(
  filters: ReviewReportFilters = {}
): Promise<ReviewReportPage> {
  const pageSize = Math.min(
    Math.max(filters.pageSize ?? 20, 1),
    50
  );

  const constraints: QueryConstraint[] = [];

  if (filters.statuses?.length) {
    constraints.push(
      where(
        "status",
        "in",
        filters.statuses.slice(0, 10)
      )
    );
  }

  if (filters.reasons?.length) {
    constraints.push(
      where(
        "reason",
        "in",
        filters.reasons.slice(0, 10)
      )
    );
  }

  if (filters.reviewId) {
    constraints.push(
      where(
        "review.reviewId",
        "==",
        filters.reviewId
      )
    );
  }

  if (filters.studioId) {
    constraints.push(
      where(
        "review.studioId",
        "==",
        filters.studioId
      )
    );
  }

  if (filters.reporterId) {
    constraints.push(
      where(
        "reporter.reporterId",
        "==",
        filters.reporterId
      )
    );
  }

  if (filters.assigneeId) {
    constraints.push(
      where(
        "assignment.assignedTo",
        "==",
        filters.assigneeId
      )
    );
  }

  if (
    typeof filters.minimumRiskScore === "number"
  ) {
    constraints.push(
      where(
        "riskScore",
        ">=",
        filters.minimumRiskScore
      )
    );
  }

  constraints.push(
    orderBy("createdAt", "desc")
  );

  if (filters.cursor) {
    constraints.push(
      startAfter(filters.cursor)
    );
  }

  constraints.push(limit(pageSize + 1));

  const snapshot = await getDocs(
    query(
      collection(db, "reviewReports"),
      ...constraints
    )
  );

  const documents = snapshot.docs.slice(
    0,
    pageSize
  );

  return {
    reports: documents.map(
      (reportDocument) =>
        ({
          id: reportDocument.id,
          ...reportDocument.data(),
        }) as ReviewReport
    ),
    cursor: documents.at(-1) ?? null,
    hasMore: snapshot.docs.length > pageSize,
  };
}

export async function getReviewReportTimeline(
  reportId: string
): Promise<readonly ReviewReportTimelineEvent[]> {
  assertIdentifier(reportId, "Report ID");

  const snapshot = await getDocs(
    query(
      collection(
        db,
        "reviewReports",
        reportId,
        "timeline"
      ),
      orderBy("createdAt", "asc")
    )
  );

  return snapshot.docs.map(
    (eventDocument) =>
      ({
        id: eventDocument.id,
        ...eventDocument.data(),
      }) as ReviewReportTimelineEvent
  );
}

export async function createReviewReport(
  input: CreateReviewReportInput
): Promise<ReviewReport> {
  const result = await createReportCallable(input);
  return result.data.report;
}

export async function assignReviewReport(
  input: AssignReviewReportInput
): Promise<ReviewReport> {
  const result = await assignReportCallable(input);
  return result.data.report;
}

export async function updateReviewReportStatus(
  input: UpdateReviewReportStatusInput
): Promise<ReviewReport> {
  const result =
    await updateReportStatusCallable(input);

  return result.data.report;
}

export async function resolveReviewReport(
  input: ResolveReviewReportInput
): Promise<ReviewReport> {
  const result = await resolveReportCallable(input);
  return result.data.report;
}

export async function mergeReviewReports(
  input: MergeReviewReportsInput
): Promise<{
  readonly primaryReport: ReviewReport;
  readonly mergedReportIds: readonly string[];
}> {
  const result = await mergeReportsCallable(input);
  return result.data;
}

export async function getReviewReportAnalytics(
  input: {
    readonly studioId?: string;
    readonly dateFrom?: string;
    readonly dateTo?: string;
  } = {}
): Promise<ReviewReportAnalytics> {
  const result = await getAnalyticsCallable(input);
  return result.data;
}
