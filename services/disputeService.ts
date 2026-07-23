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
  CreateDisputeInput,
  DisputeAssignmentInput,
  DisputeDecisionInput,
  DisputeEvidenceInput,
  DisputeMessageInput,
  DisputeStatusUpdateInput,
  DisputeWithdrawalInput,
} from "@/lib/schemas/dispute";
import type {
  Dispute,
  DisputeAnalytics,
  DisputeMessage,
  DisputeReason,
  DisputeStatus,
  DisputeTimelineEvent,
} from "@/types/dispute";

export interface DisputePage {
  readonly disputes: readonly Dispute[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

export interface DisputeListFilters {
  readonly customerId?: string;
  readonly studioId?: string;
  readonly assigneeId?: string;
  readonly statuses?: readonly DisputeStatus[];
  readonly reasons?: readonly DisputeReason[];
  readonly priorities?: readonly Dispute["priority"][];
  readonly minimumRiskScore?: number;
  readonly pageSize?: number;
  readonly cursor?:
    | QueryDocumentSnapshot<DocumentData>
    | null;
}

interface DisputeMutationResponse {
  readonly dispute: Dispute;
}

const createDisputeCallable = callableFunction<
  CreateDisputeInput,
  DisputeMutationResponse
>("createDispute");

const addEvidenceCallable = callableFunction<
  DisputeEvidenceInput,
  DisputeMutationResponse
>("addDisputeEvidence");

const assignDisputeCallable = callableFunction<
  DisputeAssignmentInput,
  DisputeMutationResponse
>("assignDispute");

const updateStatusCallable = callableFunction<
  DisputeStatusUpdateInput,
  DisputeMutationResponse
>("updateDisputeStatus");

const decideDisputeCallable = callableFunction<
  DisputeDecisionInput,
  DisputeMutationResponse
>("decideDispute");

const withdrawDisputeCallable = callableFunction<
  DisputeWithdrawalInput,
  DisputeMutationResponse
>("withdrawDispute");

const sendDisputeMessageCallable = callableFunction<
  DisputeMessageInput,
  {
    readonly message: DisputeMessage;
  }
>("sendDisputeMessage");

const getDisputeAnalyticsCallable = callableFunction<
  {
    readonly studioId?: string;
    readonly dateFrom?: string;
    readonly dateTo?: string;
  },
  DisputeAnalytics
>("getDisputeAnalytics");

function assertIdentifier(
  value: string,
  label: string
): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export async function getDispute(
  disputeId: string
): Promise<Dispute | null> {
  assertIdentifier(disputeId, "Dispute ID");

  const snapshot = await getDoc(
    doc(db, "disputes", disputeId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Dispute;
}

export async function getDisputeByNumber(
  disputeNumber: string
): Promise<Dispute | null> {
  assertIdentifier(
    disputeNumber,
    "Dispute number"
  );

  const snapshot = await getDocs(
    query(
      collection(db, "disputes"),
      where(
        "disputeNumber",
        "==",
        disputeNumber.trim()
      ),
      limit(1)
    )
  );

  const disputeDocument = snapshot.docs.at(0);

  return disputeDocument
    ? ({
        id: disputeDocument.id,
        ...disputeDocument.data(),
      } as Dispute)
    : null;
}

export async function getDisputes(
  filters: DisputeListFilters = {}
): Promise<DisputePage> {
  const pageSize = Math.min(
    Math.max(filters.pageSize ?? 20, 1),
    50
  );

  const constraints: QueryConstraint[] = [];

  if (filters.customerId) {
    constraints.push(
      where(
        "order.customerId",
        "==",
        filters.customerId
      )
    );
  }

  if (filters.studioId) {
    constraints.push(
      where(
        "order.studioId",
        "==",
        filters.studioId
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

  if (filters.priorities?.length) {
    constraints.push(
      where(
        "priority",
        "in",
        filters.priorities.slice(0, 10)
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
      collection(db, "disputes"),
      ...constraints
    )
  );

  const documents = snapshot.docs.slice(
    0,
    pageSize
  );

  return {
    disputes: documents.map(
      (disputeDocument) =>
        ({
          id: disputeDocument.id,
          ...disputeDocument.data(),
        }) as Dispute
    ),
    cursor: documents.at(-1) ?? null,
    hasMore: snapshot.docs.length > pageSize,
  };
}

export async function getDisputeTimeline(
  disputeId: string
): Promise<readonly DisputeTimelineEvent[]> {
  assertIdentifier(disputeId, "Dispute ID");

  const snapshot = await getDocs(
    query(
      collection(
        db,
        "disputes",
        disputeId,
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
      }) as DisputeTimelineEvent
  );
}

export async function getDisputeMessages(
  disputeId: string,
  includeInternal = false
): Promise<readonly DisputeMessage[]> {
  assertIdentifier(disputeId, "Dispute ID");

  const constraints: QueryConstraint[] = [];

  if (!includeInternal) {
    constraints.push(
      where("internal", "==", false)
    );
  }

  constraints.push(
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(
    query(
      collection(
        db,
        "disputes",
        disputeId,
        "messages"
      ),
      ...constraints
    )
  );

  return snapshot.docs.map(
    (messageDocument) =>
      ({
        id: messageDocument.id,
        ...messageDocument.data(),
      }) as DisputeMessage
  );
}

export async function createDispute(
  input: CreateDisputeInput
): Promise<Dispute> {
  const result = await createDisputeCallable(input);
  return result.data.dispute;
}

export async function addDisputeEvidence(
  input: DisputeEvidenceInput
): Promise<Dispute> {
  const result = await addEvidenceCallable(input);
  return result.data.dispute;
}

export async function assignDispute(
  input: DisputeAssignmentInput
): Promise<Dispute> {
  const result = await assignDisputeCallable(input);
  return result.data.dispute;
}

export async function updateDisputeStatus(
  input: DisputeStatusUpdateInput
): Promise<Dispute> {
  const result = await updateStatusCallable(input);
  return result.data.dispute;
}

export async function decideDispute(
  input: DisputeDecisionInput
): Promise<Dispute> {
  const result = await decideDisputeCallable(input);
  return result.data.dispute;
}

export async function withdrawDispute(
  input: DisputeWithdrawalInput
): Promise<Dispute> {
  const result = await withdrawDisputeCallable(input);
  return result.data.dispute;
}

export async function sendDisputeMessage(
  input: DisputeMessageInput
): Promise<DisputeMessage> {
  const result =
    await sendDisputeMessageCallable(input);

  return result.data.message;
}

export async function getDisputeAnalytics(
  input: {
    readonly studioId?: string;
    readonly dateFrom?: string;
    readonly dateTo?: string;
  } = {}
): Promise<DisputeAnalytics> {
  const result =
    await getDisputeAnalyticsCallable(input);

  return result.data;
}
