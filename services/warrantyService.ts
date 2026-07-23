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
import { callableFunction } from "@/firebase/functions";
import type {
  CancelWarrantyClaimInput,
  CreateWarrantyClaimInput,
  RegisterWarrantyInput,
  TransferWarrantyInput,
  UpdateWarrantyTrackingInput,
  VoidWarrantyInput,
  WarrantyClaimAssessmentInput,
  WarrantyClaimDecisionInput,
  WarrantyServiceAppointmentInput,
} from "@/lib/schemas/warranty";
import type {
  ProductWarranty,
  WarrantyAnalytics,
  WarrantyClaim,
  WarrantyClaimStatus,
  WarrantyStatus,
  WarrantyTimelineEvent,
} from "@/types/warranty";

export interface WarrantyPage {
  readonly warranties: readonly ProductWarranty[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

export interface WarrantyClaimPage {
  readonly claims: readonly WarrantyClaim[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

export interface WarrantyListFilters {
  readonly customerId?: string;
  readonly studioId?: string;
  readonly productId?: string;
  readonly orderId?: string;
  readonly statuses?: readonly WarrantyStatus[];
  readonly expiringBefore?: string;
  readonly pageSize?: number;
  readonly cursor?:
    | QueryDocumentSnapshot<DocumentData>
    | null;
}

export interface WarrantyClaimFilters {
  readonly customerId?: string;
  readonly studioId?: string;
  readonly warrantyId?: string;
  readonly statuses?: readonly WarrantyClaimStatus[];
  readonly priorities?: readonly WarrantyClaim["priority"][];
  readonly pageSize?: number;
  readonly cursor?:
    | QueryDocumentSnapshot<DocumentData>
    | null;
}

interface WarrantyMutationResponse {
  readonly warranty: ProductWarranty;
}

interface WarrantyClaimMutationResponse {
  readonly claim: WarrantyClaim;
  readonly warranty?: ProductWarranty;
}

const registerWarrantyCallable =
  callableFunction<
    RegisterWarrantyInput,
    WarrantyMutationResponse
  >("registerProductWarranty");

const createClaimCallable =
  callableFunction<
    CreateWarrantyClaimInput,
    WarrantyClaimMutationResponse
  >("createWarrantyClaim");

const assessClaimCallable =
  callableFunction<
    WarrantyClaimAssessmentInput,
    WarrantyClaimMutationResponse
  >("assessWarrantyClaim");

const decideClaimCallable =
  callableFunction<
    WarrantyClaimDecisionInput,
    WarrantyClaimMutationResponse
  >("decideWarrantyClaim");

const scheduleServiceCallable =
  callableFunction<
    WarrantyServiceAppointmentInput,
    WarrantyClaimMutationResponse
  >("scheduleWarrantyService");

const updateTrackingCallable =
  callableFunction<
    UpdateWarrantyTrackingInput,
    WarrantyClaimMutationResponse
  >("updateWarrantyTracking");

const completeClaimCallable =
  callableFunction<
    {
      readonly claimId: string;
      readonly completionNote: string;
    },
    WarrantyClaimMutationResponse
  >("completeWarrantyClaim");

const cancelClaimCallable =
  callableFunction<
    CancelWarrantyClaimInput,
    WarrantyClaimMutationResponse
  >("cancelWarrantyClaim");

const transferWarrantyCallable =
  callableFunction<
    TransferWarrantyInput,
    WarrantyMutationResponse
  >("transferProductWarranty");

const voidWarrantyCallable =
  callableFunction<
    VoidWarrantyInput,
    WarrantyMutationResponse
  >("voidProductWarranty");

const getAnalyticsCallable =
  callableFunction<
    {
      readonly studioId?: string;
      readonly dateFrom?: string;
      readonly dateTo?: string;
    },
    WarrantyAnalytics
  >("getWarrantyAnalytics");

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

export async function getWarranty(
  warrantyId: string
): Promise<ProductWarranty | null> {
  assertIdentifier(
    warrantyId,
    "Warranty ID"
  );

  const snapshot = await getDoc(
    doc(
      db,
      "warranties",
      warrantyId
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as ProductWarranty;
}

export async function getWarrantyByNumber(
  warrantyNumber: string
): Promise<ProductWarranty | null> {
  assertIdentifier(
    warrantyNumber,
    "Warranty number"
  );

  const snapshot = await getDocs(
    query(
      collection(
        db,
        "warranties"
      ),
      where(
        "warrantyNumber",
        "==",
        warrantyNumber.trim()
      ),
      limit(1)
    )
  );

  const warrantyDocument =
    snapshot.docs.at(0);

  return warrantyDocument
    ? ({
        id: warrantyDocument.id,
        ...warrantyDocument.data(),
      } as ProductWarranty)
    : null;
}

export async function getWarranties(
  filters: WarrantyListFilters = {}
): Promise<WarrantyPage> {
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
        "owner.customerId",
        "==",
        filters.customerId
      )
    );
  }

  if (filters.studioId) {
    constraints.push(
      where(
        "product.studioId",
        "==",
        filters.studioId
      )
    );
  }

  if (filters.productId) {
    constraints.push(
      where(
        "product.productId",
        "==",
        filters.productId
      )
    );
  }

  if (filters.orderId) {
    constraints.push(
      where(
        "product.orderId",
        "==",
        filters.orderId
      )
    );
  }

  if (filters.statuses?.length) {
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

  if (filters.expiringBefore) {
    constraints.push(
      where(
        "expiresAt",
        "<=",
        filters.expiringBefore
      )
    );
  }

  constraints.push(
    orderBy(
      "expiresAt",
      "asc"
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

  const snapshot = await getDocs(
    query(
      collection(
        db,
        "warranties"
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
    warranties: documents.map(
      (warrantyDocument) =>
        ({
          id: warrantyDocument.id,
          ...warrantyDocument.data(),
        }) as ProductWarranty
    ),
    cursor:
      documents.at(-1) ?? null,
    hasMore:
      snapshot.docs.length >
      pageSize,
  };
}

export async function getWarrantyClaim(
  claimId: string
): Promise<WarrantyClaim | null> {
  assertIdentifier(
    claimId,
    "Warranty claim ID"
  );

  const snapshot = await getDoc(
    doc(
      db,
      "warrantyClaims",
      claimId
    )
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as WarrantyClaim;
}

export async function getWarrantyClaimByNumber(
  claimNumber: string
): Promise<WarrantyClaim | null> {
  assertIdentifier(
    claimNumber,
    "Claim number"
  );

  const snapshot = await getDocs(
    query(
      collection(
        db,
        "warrantyClaims"
      ),
      where(
        "claimNumber",
        "==",
        claimNumber.trim()
      ),
      limit(1)
    )
  );

  const claimDocument =
    snapshot.docs.at(0);

  return claimDocument
    ? ({
        id: claimDocument.id,
        ...claimDocument.data(),
      } as WarrantyClaim)
    : null;
}

export async function getWarrantyClaims(
  filters: WarrantyClaimFilters = {}
): Promise<WarrantyClaimPage> {
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

  if (filters.warrantyId) {
    constraints.push(
      where(
        "warrantyId",
        "==",
        filters.warrantyId
      )
    );
  }

  if (filters.statuses?.length) {
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

  if (filters.priorities?.length) {
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

  const snapshot = await getDocs(
    query(
      collection(
        db,
        "warrantyClaims"
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
    claims: documents.map(
      (claimDocument) =>
        ({
          id: claimDocument.id,
          ...claimDocument.data(),
        }) as WarrantyClaim
    ),
    cursor:
      documents.at(-1) ?? null,
    hasMore:
      snapshot.docs.length >
      pageSize,
  };
}

export async function getWarrantyTimeline(
  warrantyId: string
): Promise<
  readonly WarrantyTimelineEvent[]
> {
  assertIdentifier(
    warrantyId,
    "Warranty ID"
  );

  const snapshot = await getDocs(
    query(
      collection(
        db,
        "warranties",
        warrantyId,
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
      }) as WarrantyTimelineEvent
  );
}

export async function getWarrantyClaimTimeline(
  claimId: string
): Promise<
  readonly WarrantyTimelineEvent[]
> {
  assertIdentifier(
    claimId,
    "Warranty claim ID"
  );

  const snapshot = await getDocs(
    query(
      collection(
        db,
        "warrantyClaims",
        claimId,
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
      }) as WarrantyTimelineEvent
  );
}

export async function registerWarranty(
  input: RegisterWarrantyInput
): Promise<ProductWarranty> {
  const result =
    await registerWarrantyCallable(
      input
    );

  return result.data.warranty;
}

export async function createWarrantyClaim(
  input: CreateWarrantyClaimInput
): Promise<WarrantyClaim> {
  const result =
    await createClaimCallable(
      input
    );

  return result.data.claim;
}

export async function assessWarrantyClaim(
  input: WarrantyClaimAssessmentInput
): Promise<WarrantyClaim> {
  const result =
    await assessClaimCallable(
      input
    );

  return result.data.claim;
}

export async function decideWarrantyClaim(
  input: WarrantyClaimDecisionInput
): Promise<WarrantyClaim> {
  const result =
    await decideClaimCallable(
      input
    );

  return result.data.claim;
}

export async function scheduleWarrantyService(
  input: WarrantyServiceAppointmentInput
): Promise<WarrantyClaim> {
  const result =
    await scheduleServiceCallable(
      input
    );

  return result.data.claim;
}

export async function updateWarrantyTracking(
  input: UpdateWarrantyTrackingInput
): Promise<WarrantyClaim> {
  const result =
    await updateTrackingCallable(
      input
    );

  return result.data.claim;
}

export async function completeWarrantyClaim(
  claimId: string,
  completionNote: string
): Promise<WarrantyClaim> {
  assertIdentifier(
    claimId,
    "Warranty claim ID"
  );

  if (
    completionNote.trim().length <
    10
  ) {
    throw new Error(
      "A clear completion note is required."
    );
  }

  const result =
    await completeClaimCallable({
      claimId,
      completionNote:
        completionNote.trim(),
    });

  return result.data.claim;
}

export async function cancelWarrantyClaim(
  input: CancelWarrantyClaimInput
): Promise<WarrantyClaim> {
  const result =
    await cancelClaimCallable(
      input
    );

  return result.data.claim;
}

export async function transferWarranty(
  input: TransferWarrantyInput
): Promise<ProductWarranty> {
  const result =
    await transferWarrantyCallable(
      input
    );

  return result.data.warranty;
}

export async function voidWarranty(
  input: VoidWarrantyInput
): Promise<ProductWarranty> {
  const result =
    await voidWarrantyCallable(
      input
    );

  return result.data.warranty;
}

export async function getWarrantyAnalytics(
  input: {
    readonly studioId?: string;
    readonly dateFrom?: string;
    readonly dateTo?: string;
  } = {}
): Promise<WarrantyAnalytics> {
  const result =
    await getAnalyticsCallable(
      input
    );

  return result.data;
}
