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

import { getFirebaseFirestore } from "@/firebase/firestore";

const db = getFirebaseFirestore();
import {
  callableFunction,
} from "@/firebase/functions";
import type {
  CancelReturnInput,
  CreateReturnRequestInput,
  ReturnDecisionInput,
  ReturnInspectionInput,
  ScheduleReturnPickupInput,
  UpdateReturnTrackingInput,
} from "@/lib/schemas/return";
import type {
  ReturnAnalytics,
  ReturnReason,
  ReturnRequest,
  ReturnStatus,
  ReturnTimelineEvent,
} from "@/types/return";

export interface ReturnPage {
  readonly returns: readonly ReturnRequest[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

export interface ReturnListFilters {
  readonly customerId?: string;
  readonly studioId?: string;
  readonly orderId?: string;
  readonly statuses?: readonly ReturnStatus[];
  readonly reasons?: readonly ReturnReason[];
  readonly priorities?: readonly ReturnRequest["priority"][];
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly pageSize?: number;
  readonly cursor?:
    | QueryDocumentSnapshot<DocumentData>
    | null;
}

interface ReturnMutationResponse {
  readonly returnRequest: ReturnRequest;
}

const createReturnCallable =
  callableFunction<
    CreateReturnRequestInput,
    ReturnMutationResponse
  >("createReturnRequest");

const decideReturnCallable =
  callableFunction<
    ReturnDecisionInput,
    ReturnMutationResponse
  >("decideReturnRequest");

const schedulePickupCallable =
  callableFunction<
    ScheduleReturnPickupInput,
    ReturnMutationResponse
  >("scheduleReturnPickup");

const updateTrackingCallable =
  callableFunction<
    UpdateReturnTrackingInput,
    ReturnMutationResponse
  >("updateReturnTracking");

const completeInspectionCallable =
  callableFunction<
    ReturnInspectionInput,
    ReturnMutationResponse
  >("completeReturnInspection");

const cancelReturnCallable =
  callableFunction<
    CancelReturnInput,
    ReturnMutationResponse
  >("cancelReturnRequest");

const markReturnReceivedCallable =
  callableFunction<
    {
      readonly returnId: string;
      readonly receivedAt?: string;
    },
    ReturnMutationResponse
  >("markReturnReceived");

const completeReturnCallable =
  callableFunction<
    {
      readonly returnId: string;
    },
    ReturnMutationResponse
  >("completeReturnRequest");

const getReturnAnalyticsCallable =
  callableFunction<
    {
      readonly studioId?: string;
      readonly dateFrom?: string;
      readonly dateTo?: string;
    },
    ReturnAnalytics
  >("getReturnAnalytics");

function assertIdentifier(
  value: string,
  label: string
): void {
  if (!value.trim()) {
    throw new Error(
      `${label} is required.`
    );
  }
}

export async function getReturnRequest(
  returnId: string
): Promise<ReturnRequest | null> {
  assertIdentifier(
    returnId,
    "Return ID"
  );

  const snapshot =
    await getDoc(
      doc(
        db,
        "returns",
        returnId
      )
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as ReturnRequest;
}

export async function getReturnByNumber(
  returnNumber: string
): Promise<ReturnRequest | null> {
  assertIdentifier(
    returnNumber,
    "Return number"
  );

  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "returns"
        ),
        where(
          "returnNumber",
          "==",
          returnNumber.trim()
        ),
        limit(1)
      )
    );

  const returnDocument =
    snapshot.docs.at(0);

  return returnDocument
    ? ({
        id: returnDocument.id,
        ...returnDocument.data(),
      } as ReturnRequest)
    : null;
}

export async function getReturns(
  filters: ReturnListFilters = {}
): Promise<ReturnPage> {
  const pageSize = Math.min(
    Math.max(
      filters.pageSize ?? 20,
      1
    ),
    50
  );

  const constraints: QueryConstraint[] =
    [];

  if (filters.customerId) {
    constraints.push(
      where(
        "customerId",
        "==",
        filters.customerId
      )
    );
  }

  if (filters.studioId) {
    constraints.push(
      where(
        "studioId",
        "==",
        filters.studioId
      )
    );
  }

  if (filters.orderId) {
    constraints.push(
      where(
        "orderId",
        "==",
        filters.orderId
      )
    );
  }

  if (
    filters.statuses?.length
  ) {
    constraints.push(
      where(
        "status",
        "in",
        filters.statuses.slice(
          0,
          10
        )
      )
    );
  }

  if (
    filters.reasons?.length
  ) {
    constraints.push(
      where(
        "reason",
        "in",
        filters.reasons.slice(
          0,
          10
        )
      )
    );
  }

  if (
    filters.priorities
      ?.length
  ) {
    constraints.push(
      where(
        "priority",
        "in",
        filters.priorities.slice(
          0,
          10
        )
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
    orderBy(
      "createdAt",
      "desc"
    )
  );

  if (filters.cursor) {
    constraints.push(
      startAfter(
        filters.cursor
      )
    );
  }

  constraints.push(
    limit(pageSize + 1)
  );

  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "returns"
        ),
        ...constraints
      )
    );

  const documents =
    snapshot.docs.slice(
      0,
      pageSize
    );

  return {
    returns: documents.map(
      (returnDocument) =>
        ({
          id:
            returnDocument.id,
          ...returnDocument.data(),
        }) as ReturnRequest
    ),
    cursor:
      documents.at(-1) ??
      null,
    hasMore:
      snapshot.docs.length >
      pageSize,
  };
}

export async function getReturnTimeline(
  returnId: string
): Promise<
  readonly ReturnTimelineEvent[]
> {
  assertIdentifier(
    returnId,
    "Return ID"
  );

  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "returns",
          returnId,
          "timeline"
        ),
        orderBy(
          "createdAt",
          "asc"
        )
      )
    );

  return snapshot.docs.map(
    (eventDocument) =>
      ({
        id: eventDocument.id,
        ...eventDocument.data(),
      }) as ReturnTimelineEvent
  );
}

export async function createReturnRequest(
  input: CreateReturnRequestInput
): Promise<ReturnRequest> {
  const result =
    await createReturnCallable(
      input
    );

  return result.data
    .returnRequest;
}

export async function decideReturnRequest(
  input: ReturnDecisionInput
): Promise<ReturnRequest> {
  const result =
    await decideReturnCallable(
      input
    );

  return result.data
    .returnRequest;
}

export async function scheduleReturnPickup(
  input: ScheduleReturnPickupInput
): Promise<ReturnRequest> {
  const result =
    await schedulePickupCallable(
      input
    );

  return result.data
    .returnRequest;
}

export async function updateReturnTracking(
  input: UpdateReturnTrackingInput
): Promise<ReturnRequest> {
  const result =
    await updateTrackingCallable(
      input
    );

  return result.data
    .returnRequest;
}

export async function markReturnReceived(
  returnId: string,
  receivedAt?: string
): Promise<ReturnRequest> {
  assertIdentifier(
    returnId,
    "Return ID"
  );

  const result =
    await markReturnReceivedCallable(
      {
        returnId,
        receivedAt,
      }
    );

  return result.data
    .returnRequest;
}

export async function completeReturnInspection(
  input: ReturnInspectionInput
): Promise<ReturnRequest> {
  const result =
    await completeInspectionCallable(
      input
    );

  return result.data
    .returnRequest;
}

export async function cancelReturnRequest(
  input: CancelReturnInput
): Promise<ReturnRequest> {
  const result =
    await cancelReturnCallable(
      input
    );

  return result.data
    .returnRequest;
}

export async function completeReturnRequest(
  returnId: string
): Promise<ReturnRequest> {
  assertIdentifier(
    returnId,
    "Return ID"
  );

  const result =
    await completeReturnCallable(
      {
        returnId,
      }
    );

  return result.data
    .returnRequest;
}

export async function getReturnAnalytics(
  input: {
    readonly studioId?: string;
    readonly dateFrom?: string;
    readonly dateTo?: string;
  } = {}
): Promise<ReturnAnalytics> {
  const result =
    await getReturnAnalyticsCallable(
      input
    );

  return result.data;
}
