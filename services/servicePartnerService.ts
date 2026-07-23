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
import {
  callableFunction,
} from "@/firebase/functions";
import type {
  AssignServicePartnerInput,
  CreateServicePartnerApplicationInput,
  ReviewServicePartnerApplicationInput,
  UpdateServiceAssignmentStatusInput,
  UpdateServicePartnerAvailabilityInput,
  UpdateServicePartnerStatusInput,
} from "@/lib/schemas/service-partner";
import type {
  ServicePartner,
  ServicePartnerAnalytics,
  ServicePartnerApplication,
  ServicePartnerAssignment,
  ServicePartnerCapability,
  ServicePartnerStatus,
  ServicePartnerType,
} from "@/types/service-partner";

export interface ServicePartnerPage {
  readonly partners: readonly ServicePartner[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

export interface ServicePartnerApplicationPage {
  readonly applications: readonly ServicePartnerApplication[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

export interface ServicePartnerAssignmentPage {
  readonly assignments: readonly ServicePartnerAssignment[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

export interface ServicePartnerFilters {
  readonly statuses?: readonly ServicePartnerStatus[];
  readonly partnerTypes?: readonly ServicePartnerType[];
  readonly capabilities?: readonly ServicePartnerCapability[];
  readonly state?: string;
  readonly city?: string;
  readonly acceptingAssignments?: boolean;
  readonly minimumQualityScore?: number;
  readonly minimumRating?: number;
  readonly pageSize?: number;
  readonly cursor?:
    | QueryDocumentSnapshot<DocumentData>
    | null;
}

export interface ServicePartnerApplicationFilters {
  readonly applicantUserId?: string;
  readonly statuses?: readonly ServicePartnerApplication["status"][];
  readonly partnerTypes?: readonly ServicePartnerType[];
  readonly reviewerId?: string;
  readonly pageSize?: number;
  readonly cursor?:
    | QueryDocumentSnapshot<DocumentData>
    | null;
}

export interface ServicePartnerAssignmentFilters {
  readonly partnerId?: string;
  readonly customerId?: string;
  readonly studioId?: string;
  readonly sourceType?: ServicePartnerAssignment["sourceType"];
  readonly sourceId?: string;
  readonly statuses?: readonly ServicePartnerAssignment["status"][];
  readonly priorities?: readonly ServicePartnerAssignment["priority"][];
  readonly pageSize?: number;
  readonly cursor?:
    | QueryDocumentSnapshot<DocumentData>
    | null;
}

interface ServicePartnerMutationResponse {
  readonly partner: ServicePartner;
}

interface ServicePartnerApplicationMutationResponse {
  readonly application: ServicePartnerApplication;
  readonly partner?: ServicePartner;
}

interface ServicePartnerAssignmentMutationResponse {
  readonly assignment: ServicePartnerAssignment;
}

const createApplicationCallable =
  callableFunction<
    CreateServicePartnerApplicationInput,
    ServicePartnerApplicationMutationResponse
  >("createServicePartnerApplication");

const reviewApplicationCallable =
  callableFunction<
    ReviewServicePartnerApplicationInput,
    ServicePartnerApplicationMutationResponse
  >("reviewServicePartnerApplication");

const updateStatusCallable =
  callableFunction<
    UpdateServicePartnerStatusInput,
    ServicePartnerMutationResponse
  >("updateServicePartnerStatus");

const updateAvailabilityCallable =
  callableFunction<
    UpdateServicePartnerAvailabilityInput,
    ServicePartnerMutationResponse
  >("updateServicePartnerAvailability");

const assignPartnerCallable =
  callableFunction<
    AssignServicePartnerInput,
    ServicePartnerAssignmentMutationResponse
  >("assignServicePartner");

const updateAssignmentStatusCallable =
  callableFunction<
    UpdateServiceAssignmentStatusInput,
    ServicePartnerAssignmentMutationResponse
  >("updateServiceAssignmentStatus");

const getAnalyticsCallable =
  callableFunction<
    {
      readonly dateFrom?: string;
      readonly dateTo?: string;
      readonly state?: string;
    },
    ServicePartnerAnalytics
  >("getServicePartnerAnalytics");

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

function mapDocument<T>(
  snapshot: QueryDocumentSnapshot<DocumentData>
): T {
  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as T;
}

export async function getServicePartner(
  partnerId: string
): Promise<ServicePartner | null> {
  assertIdentifier(
    partnerId,
    "Service partner ID"
  );

  const snapshot =
    await getDoc(
      doc(
        db,
        "servicePartners",
        partnerId
      )
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as ServicePartner;
}

export async function getServicePartnerByNumber(
  partnerNumber: string
): Promise<ServicePartner | null> {
  assertIdentifier(
    partnerNumber,
    "Service partner number"
  );

  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "servicePartners"
        ),
        where(
          "partnerNumber",
          "==",
          partnerNumber.trim()
        ),
        limit(1)
      )
    );

  const partnerDocument =
    snapshot.docs.at(0);

  return partnerDocument
    ? mapDocument<ServicePartner>(
        partnerDocument
      )
    : null;
}

export async function getServicePartnerBySlug(
  slug: string
): Promise<ServicePartner | null> {
  assertIdentifier(
    slug,
    "Service partner slug"
  );

  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "servicePartners"
        ),
        where(
          "slug",
          "==",
          slug.trim().toLowerCase()
        ),
        limit(1)
      )
    );

  const partnerDocument =
    snapshot.docs.at(0);

  return partnerDocument
    ? mapDocument<ServicePartner>(
        partnerDocument
      )
    : null;
}

export async function getServicePartners(
  filters: ServicePartnerFilters = {}
): Promise<ServicePartnerPage> {
  const pageSize = Math.min(
    Math.max(
      filters.pageSize ?? 20,
      1
    ),
    50
  );

  const constraints: QueryConstraint[] =
    [];

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

  if (
    filters.partnerTypes
      ?.length
  ) {
    constraints.push(
      where(
        "partnerType",
        "in",
        filters.partnerTypes.slice(
          0,
          10
        )
      )
    );
  }

  if (
    filters.capabilities
      ?.length
  ) {
    constraints.push(
      where(
        "capabilityKeys",
        "array-contains-any",
        filters.capabilities.slice(
          0,
          10
        )
      )
    );
  }

  if (filters.state) {
    constraints.push(
      where(
        "coverageStateKeys",
        "array-contains",
        filters.state
          .trim()
          .toLowerCase()
      )
    );
  }

  if (filters.city) {
    constraints.push(
      where(
        "coverageCityKeys",
        "array-contains",
        filters.city
          .trim()
          .toLowerCase()
      )
    );
  }

  if (
    typeof filters.acceptingAssignments ===
    "boolean"
  ) {
    constraints.push(
      where(
        "acceptingAssignments",
        "==",
        filters.acceptingAssignments
      )
    );
  }

  if (
    typeof filters.minimumQualityScore ===
    "number"
  ) {
    constraints.push(
      where(
        "performance.qualityScore",
        ">=",
        filters.minimumQualityScore
      )
    );
  }

  if (
    typeof filters.minimumRating ===
    "number"
  ) {
    constraints.push(
      where(
        "performance.customerRating",
        ">=",
        filters.minimumRating
      )
    );
  }

  constraints.push(
    orderBy(
      "performance.qualityScore",
      "desc"
    ),
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
          "servicePartners"
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
    partners: documents.map(
      (
        partnerDocument
      ) =>
        mapDocument<ServicePartner>(
          partnerDocument
        )
    ),
    cursor:
      documents.at(-1) ?? null,
    hasMore:
      snapshot.docs.length >
      pageSize,
  };
}

export async function getServicePartnerApplication(
  applicationId: string
): Promise<ServicePartnerApplication | null> {
  assertIdentifier(
    applicationId,
    "Application ID"
  );

  const snapshot =
    await getDoc(
      doc(
        db,
        "servicePartnerApplications",
        applicationId
      )
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as ServicePartnerApplication;
}

export async function getServicePartnerApplications(
  filters: ServicePartnerApplicationFilters = {}
): Promise<ServicePartnerApplicationPage> {
  const pageSize = Math.min(
    Math.max(
      filters.pageSize ?? 20,
      1
    ),
    50
  );

  const constraints: QueryConstraint[] =
    [];

  if (
    filters.applicantUserId
  ) {
    constraints.push(
      where(
        "applicantUserId",
        "==",
        filters.applicantUserId
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

  if (
    filters.partnerTypes
      ?.length
  ) {
    constraints.push(
      where(
        "partnerType",
        "in",
        filters.partnerTypes.slice(
          0,
          10
        )
      )
    );
  }

  if (filters.reviewerId) {
    constraints.push(
      where(
        "reviewerId",
        "==",
        filters.reviewerId
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
          "servicePartnerApplications"
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
    applications:
      documents.map(
        (
          applicationDocument
        ) =>
          mapDocument<ServicePartnerApplication>(
            applicationDocument
          )
      ),
    cursor:
      documents.at(-1) ?? null,
    hasMore:
      snapshot.docs.length >
      pageSize,
  };
}

export async function getServicePartnerAssignment(
  assignmentId: string
): Promise<ServicePartnerAssignment | null> {
  assertIdentifier(
    assignmentId,
    "Assignment ID"
  );

  const snapshot =
    await getDoc(
      doc(
        db,
        "servicePartnerAssignments",
        assignmentId
      )
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as ServicePartnerAssignment;
}

export async function getServicePartnerAssignments(
  filters: ServicePartnerAssignmentFilters = {}
): Promise<ServicePartnerAssignmentPage> {
  const pageSize = Math.min(
    Math.max(
      filters.pageSize ?? 20,
      1
    ),
    50
  );

  const constraints: QueryConstraint[] =
    [];

  if (filters.partnerId) {
    constraints.push(
      where(
        "partnerId",
        "==",
        filters.partnerId
      )
    );
  }

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

  if (filters.sourceType) {
    constraints.push(
      where(
        "sourceType",
        "==",
        filters.sourceType
      )
    );
  }

  if (filters.sourceId) {
    constraints.push(
      where(
        "sourceId",
        "==",
        filters.sourceId
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

  constraints.push(
    orderBy(
      "responseDueAt",
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

  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "servicePartnerAssignments"
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
    assignments:
      documents.map(
        (
          assignmentDocument
        ) =>
          mapDocument<ServicePartnerAssignment>(
            assignmentDocument
          )
      ),
    cursor:
      documents.at(-1) ?? null,
    hasMore:
      snapshot.docs.length >
      pageSize,
  };
}

export async function createServicePartnerApplication(
  input: CreateServicePartnerApplicationInput
): Promise<ServicePartnerApplication> {
  const result =
    await createApplicationCallable(
      input
    );

  return result.data
    .application;
}

export async function reviewServicePartnerApplication(
  input: ReviewServicePartnerApplicationInput
): Promise<{
  readonly application: ServicePartnerApplication;
  readonly partner?: ServicePartner;
}> {
  const result =
    await reviewApplicationCallable(
      input
    );

  return result.data;
}

export async function updateServicePartnerStatus(
  input: UpdateServicePartnerStatusInput
): Promise<ServicePartner> {
  const result =
    await updateStatusCallable(
      input
    );

  return result.data.partner;
}

export async function updateServicePartnerAvailability(
  input: UpdateServicePartnerAvailabilityInput
): Promise<ServicePartner> {
  const result =
    await updateAvailabilityCallable(
      input
    );

  return result.data.partner;
}

export async function assignServicePartner(
  input: AssignServicePartnerInput
): Promise<ServicePartnerAssignment> {
  const result =
    await assignPartnerCallable(
      input
    );

  return result.data
    .assignment;
}

export async function updateServiceAssignmentStatus(
  input: UpdateServiceAssignmentStatusInput
): Promise<ServicePartnerAssignment> {
  const result =
    await updateAssignmentStatusCallable(
      input
    );

  return result.data
    .assignment;
}

export async function getServicePartnerAnalytics(
  input: {
    readonly dateFrom?: string;
    readonly dateTo?: string;
    readonly state?: string;
  } = {}
): Promise<ServicePartnerAnalytics> {
  const result =
    await getAnalyticsCallable(
      input
    );

  return result.data;
}
