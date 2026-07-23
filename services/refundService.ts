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
  RefundRequestInput,
} from "@/lib/schemas/refund";
import type {
  Refund,
  RefundStatus,
} from "@/types/refund";

export interface RefundPage {
  readonly refunds: readonly Refund[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

export interface RefundListFilters {
  readonly orderId?: string;
  readonly paymentId?: string;
  readonly statuses?: readonly RefundStatus[];
  readonly processedBy?: string;
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly pageSize?: number;
  readonly cursor?:
    | QueryDocumentSnapshot<DocumentData>
    | null;
}

export interface RefundDecisionInput {
  readonly refundId: string;
  readonly approved: boolean;
  readonly reason: string;
}

export interface RefundProcessingInput {
  readonly refundId: string;
  readonly providerReference?: string;
}

export interface RefundFailureInput {
  readonly refundId: string;
  readonly failureReason: string;
  readonly providerReference?: string;
}

export interface RefundAnalytics {
  readonly totalRefunds: number;
  readonly pendingRefunds: number;
  readonly processingRefunds: number;
  readonly completedRefunds: number;
  readonly failedRefunds: number;
  readonly approvedValuePaise: number;
  readonly completedValuePaise: number;
  readonly failedValuePaise: number;
  readonly averageProcessingHours: number;
}

interface RefundMutationResponse {
  readonly refund: Refund;
}

const requestRefundCallable = callableFunction<
  RefundRequestInput,
  RefundMutationResponse
>("requestRefund");

const decideRefundCallable = callableFunction<
  RefundDecisionInput,
  RefundMutationResponse
>("decideRefund");

const processRefundCallable = callableFunction<
  RefundProcessingInput,
  RefundMutationResponse
>("processRefund");

const completeRefundCallable = callableFunction<
  RefundProcessingInput,
  RefundMutationResponse
>("completeRefund");

const failRefundCallable = callableFunction<
  RefundFailureInput,
  RefundMutationResponse
>("failRefund");

const cancelRefundCallable = callableFunction<
  {
    readonly refundId: string;
    readonly reason: string;
  },
  RefundMutationResponse
>("cancelRefund");

const getRefundAnalyticsCallable = callableFunction<
  {
    readonly studioId?: string;
    readonly dateFrom?: string;
    readonly dateTo?: string;
  },
  RefundAnalytics
>("getRefundAnalytics");

function assertIdentifier(
  value: string,
  label: string
): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export async function getRefund(
  refundId: string
): Promise<Refund | null> {
  assertIdentifier(refundId, "Refund ID");

  const snapshot = await getDoc(
    doc(db, "refunds", refundId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Refund;
}

export async function getRefundByNumber(
  refundNumber: string
): Promise<Refund | null> {
  assertIdentifier(
    refundNumber,
    "Refund number"
  );

  const snapshot = await getDocs(
    query(
      collection(db, "refunds"),
      where(
        "refundNumber",
        "==",
        refundNumber.trim()
      ),
      limit(1)
    )
  );

  const refundDocument = snapshot.docs.at(0);

  return refundDocument
    ? ({
        id: refundDocument.id,
        ...refundDocument.data(),
      } as Refund)
    : null;
}

export async function getRefunds(
  filters: RefundListFilters = {}
): Promise<RefundPage> {
  const pageSize = Math.min(
    Math.max(filters.pageSize ?? 20, 1),
    50
  );

  const constraints: QueryConstraint[] = [];

  if (filters.orderId) {
    constraints.push(
      where(
        "orderId",
        "==",
        filters.orderId
      )
    );
  }

  if (filters.paymentId) {
    constraints.push(
      where(
        "paymentId",
        "==",
        filters.paymentId
      )
    );
  }

  if (filters.statuses?.length) {
    constraints.push(
      where(
        "status",
        "in",
        filters.statuses.slice(0, 10)
      )
    );
  }

  if (filters.processedBy) {
    constraints.push(
      where(
        "processedBy",
        "==",
        filters.processedBy
      )
    );
  }

  if (filters.dateFrom) {
    constraints.push(
      where(
        "createdAt",
        ">=",
        filters.dateFrom
      )
    );
  }

  if (filters.dateTo) {
    constraints.push(
      where(
        "createdAt",
        "<=",
        filters.dateTo
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

  constraints.push(
    limit(pageSize + 1)
  );

  const snapshot = await getDocs(
    query(
      collection(db, "refunds"),
      ...constraints
    )
  );

  const documents = snapshot.docs.slice(
    0,
    pageSize
  );

  return {
    refunds: documents.map(
      (refundDocument) =>
        ({
          id: refundDocument.id,
          ...refundDocument.data(),
        }) as Refund
    ),
    cursor: documents.at(-1) ?? null,
    hasMore:
      snapshot.docs.length > pageSize,
  };
}

export async function requestRefund(
  input: RefundRequestInput
): Promise<Refund> {
  const result =
    await requestRefundCallable(input);

  return result.data.refund;
}

export async function decideRefund(
  input: RefundDecisionInput
): Promise<Refund> {
  if (input.reason.trim().length < 10) {
    throw new Error(
      "A clear refund decision reason is required."
    );
  }

  const result =
    await decideRefundCallable({
      ...input,
      reason: input.reason.trim(),
    });

  return result.data.refund;
}

export async function processRefund(
  input: RefundProcessingInput
): Promise<Refund> {
  const result =
    await processRefundCallable(input);

  return result.data.refund;
}

export async function completeRefund(
  input: RefundProcessingInput
): Promise<Refund> {
  const result =
    await completeRefundCallable(input);

  return result.data.refund;
}

export async function failRefund(
  input: RefundFailureInput
): Promise<Refund> {
  if (
    input.failureReason.trim().length < 10
  ) {
    throw new Error(
      "A clear refund failure reason is required."
    );
  }

  const result =
    await failRefundCallable({
      ...input,
      failureReason:
        input.failureReason.trim(),
    });

  return result.data.refund;
}

export async function cancelRefund(
  refundId: string,
  reason: string
): Promise<Refund> {
  assertIdentifier(refundId, "Refund ID");

  if (reason.trim().length < 10) {
    throw new Error(
      "A clear cancellation reason is required."
    );
  }

  const result =
    await cancelRefundCallable({
      refundId,
      reason: reason.trim(),
    });

  return result.data.refund;
}

export async function getRefundAnalytics(
  input: {
    readonly studioId?: string;
    readonly dateFrom?: string;
    readonly dateTo?: string;
  } = {}
): Promise<RefundAnalytics> {
  const result =
    await getRefundAnalyticsCallable(input);

  return result.data;
}
