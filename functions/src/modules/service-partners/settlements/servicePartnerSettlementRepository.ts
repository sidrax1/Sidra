import type {
  DocumentReference,
  QueryDocumentSnapshot,
  Transaction,
} from "firebase-admin/firestore";
import type {
  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
} from "firebase-functions/v2/https";

import {
  firestore,
} from "../servicePartnerRepository";
import type {
  ServicePartnerSettlementDocument,
  ServicePartnerSettlementLine,
  SerializedServicePartnerSettlement,
  SerializedServicePartnerSettlementLine,
} from "./servicePartnerSettlementTypes";

export const settlementCollections = {
  settlements:
    "servicePartnerSettlements",
  settlementLines:
    "servicePartnerSettlementLines",
  settlementProfiles:
    "servicePartnerSettlementProfiles",
  adjustments:
    "servicePartnerSettlementAdjustments",
  paymentEvents:
    "servicePartnerSettlementPaymentEvents",
} as const;

export function settlementReference(
  settlementId: string
): DocumentReference<ServicePartnerSettlementDocument> {
  return firestore
    .collection(
      settlementCollections.settlements
    )
    .doc(
      settlementId
    ) as DocumentReference<ServicePartnerSettlementDocument>;
}

export function settlementLineReference(
  settlementId: string,
  lineId: string
): DocumentReference<ServicePartnerSettlementLine> {
  return settlementReference(
    settlementId
  )
    .collection("lines")
    .doc(
      lineId
    ) as DocumentReference<ServicePartnerSettlementLine>;
}

export function settlementProfileReference(
  partnerId: string
): DocumentReference {
  return firestore
    .collection(
      settlementCollections.settlementProfiles
    )
    .doc(partnerId);
}

export function serializeSettlementLine(
  line: ServicePartnerSettlementLine
): SerializedServicePartnerSettlementLine {
  return {
    ...line,
    createdAt:
      line.createdAt
        .toDate()
        .toISOString(),
  };
}

function serializeOptionalTimestamp(
  value?: Timestamp
): string | undefined {
  return value
    ? value
        .toDate()
        .toISOString()
    : undefined;
}

export function serializeSettlement(
  id: string,
  settlement: ServicePartnerSettlementDocument
): SerializedServicePartnerSettlement {
  return {
    id,
    ...settlement,
    periodStart:
      settlement.periodStart
        .toDate()
        .toISOString(),
    periodEnd:
      settlement.periodEnd
        .toDate()
        .toISOString(),
    calculatedAt:
      settlement.calculatedAt
        .toDate()
        .toISOString(),
    reviewedAt:
      serializeOptionalTimestamp(
        settlement.reviewedAt
      ),
    approvedAt:
      serializeOptionalTimestamp(
        settlement.approvedAt
      ),
    processingStartedAt:
      serializeOptionalTimestamp(
        settlement.processingStartedAt
      ),
    paidAt:
      serializeOptionalTimestamp(
        settlement.paidAt
      ),
    failedAt:
      serializeOptionalTimestamp(
        settlement.failedAt
      ),
    cancelledAt:
      serializeOptionalTimestamp(
        settlement.cancelledAt
      ),
    createdAt:
      settlement.createdAt
        .toDate()
        .toISOString(),
    updatedAt:
      settlement.updatedAt
        .toDate()
        .toISOString(),
    bankSnapshot:
      settlement.bankSnapshot
        ? {
            ...settlement.bankSnapshot,
            verifiedAt:
              serializeOptionalTimestamp(
                settlement
                  .bankSnapshot
                  .verifiedAt
              ),
          }
        : undefined,
  };
}

export async function assertSettlementNumberUnique(
  transaction: Transaction,
  settlementNumber: string
): Promise<void> {
  const existingQuery =
    firestore
      .collection(
        settlementCollections.settlements
      )
      .where(
        "settlementNumber",
        "==",
        settlementNumber
      )
      .limit(1);

  const snapshot =
    await transaction.get(
      existingQuery
    );

  if (!snapshot.empty) {
    throw new HttpsError(
      "already-exists",
      "Settlement number already exists."
    );
  }
}

export async function getSettlementWithLines(
  settlementId: string
): Promise<{
  readonly settlement: SerializedServicePartnerSettlement;
  readonly lines: readonly SerializedServicePartnerSettlementLine[];
}> {
  const reference =
    settlementReference(
      settlementId
    );

  const [
    settlementSnapshot,
    lineSnapshot,
  ] = await Promise.all([
    reference.get(),
    reference
      .collection("lines")
      .orderBy(
        "createdAt",
        "asc"
      )
      .get(),
  ]);

  if (
    !settlementSnapshot.exists
  ) {
    throw new HttpsError(
      "not-found",
      "Service-partner settlement was not found."
    );
  }

  return {
    settlement:
      serializeSettlement(
        settlementSnapshot.id,
        settlementSnapshot.data()!
      ),
    lines:
      lineSnapshot.docs.map(
        (
          document: QueryDocumentSnapshot
        ) =>
          serializeSettlementLine(
            document.data() as ServicePartnerSettlementLine
          )
      ),
  };
}

export function createPaymentEventReference(): DocumentReference {
  return firestore
    .collection(
      settlementCollections.paymentEvents
    )
    .doc();
}
