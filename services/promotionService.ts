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
  PromotionInput,
  PromotionStatusInput,
  ValidatePromotionCodeInput,
} from "@/lib/schemas/promotion";
import type {
  Promotion,
  PromotionRedemption,
  PromotionStatus,
} from "@/types/promotion";

interface PromotionMutationResponse {
  readonly promotion: Promotion;
}

export interface PromotionValidationResult {
  readonly valid: boolean;
  readonly promotionId?: string;
  readonly promotionName?: string;
  readonly discountPaise: number;
  readonly shippingDiscountPaise: number;
  readonly message: string;
}

export interface PromotionPage {
  readonly promotions: readonly Promotion[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

const createPromotionCallable = callableFunction<
  PromotionInput,
  PromotionMutationResponse
>("createPromotion");

const updatePromotionCallable = callableFunction<
  PromotionInput & {
    readonly promotionId: string;
  },
  PromotionMutationResponse
>("updatePromotion");

const updateStatusCallable = callableFunction<
  PromotionStatusInput,
  PromotionMutationResponse
>("updatePromotionStatus");

const validateCodeCallable = callableFunction<
  ValidatePromotionCodeInput,
  PromotionValidationResult
>("validatePromotionCode");

const deletePromotionCallable = callableFunction<
  {
    readonly promotionId: string;
  },
  {
    readonly success: true;
  }
>("deletePromotion");

export async function getPromotion(
  promotionId: string
): Promise<Promotion | null> {
  const snapshot = await getDoc(
    doc(db, "promotions", promotionId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Promotion;
}

export async function getPromotionByCode(
  code: string
): Promise<Promotion | null> {
  const normalizedCode = code.trim().toUpperCase();

  const snapshot = await getDocs(
    query(
      collection(db, "promotions"),
      where("code", "==", normalizedCode),
      limit(1)
    )
  );

  const promotionDocument = snapshot.docs.at(0);

  return promotionDocument
    ? ({
        id: promotionDocument.id,
        ...promotionDocument.data(),
      } as Promotion)
    : null;
}

export async function getPromotions(input: {
  readonly studioId?: string;
  readonly statuses?: readonly PromotionStatus[];
  readonly pageSize?: number;
  readonly cursor?: QueryDocumentSnapshot<DocumentData> | null;
}): Promise<PromotionPage> {
  const pageSize = Math.min(
    Math.max(input.pageSize ?? 20, 1),
    50
  );

  const constraints: QueryConstraint[] = [];

  if (input.studioId) {
    constraints.push(
      where(
        "eligibility.studioIds",
        "array-contains",
        input.studioId
      )
    );
  }

  if (input.statuses?.length) {
    constraints.push(
      where("status", "in", input.statuses.slice(0, 10))
    );
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (input.cursor) {
    constraints.push(startAfter(input.cursor));
  }

  constraints.push(limit(pageSize + 1));

  const snapshot = await getDocs(
    query(collection(db, "promotions"), ...constraints)
  );

  const documents = snapshot.docs.slice(0, pageSize);

  return {
    promotions: documents.map(
      (promotionDocument) =>
        ({
          id: promotionDocument.id,
          ...promotionDocument.data(),
        }) as Promotion
    ),
    cursor: documents.at(-1) ?? null,
    hasMore: snapshot.docs.length > pageSize,
  };
}

export async function getPromotionRedemptions(
  promotionId: string
): Promise<readonly PromotionRedemption[]> {
  const snapshot = await getDocs(
    query(
      collection(
        db,
        "promotions",
        promotionId,
        "redemptions"
      ),
      orderBy("redeemedAt", "desc"),
      limit(250)
    )
  );

  return snapshot.docs.map(
    (redemptionDocument) =>
      ({
        id: redemptionDocument.id,
        ...redemptionDocument.data(),
      }) as PromotionRedemption
  );
}

export async function createPromotion(
  input: PromotionInput
): Promise<Promotion> {
  const result = await createPromotionCallable(input);
  return result.data.promotion;
}

export async function updatePromotion(
  promotionId: string,
  input: PromotionInput
): Promise<Promotion> {
  const result = await updatePromotionCallable({
    promotionId,
    ...input,
  });

  return result.data.promotion;
}

export async function updatePromotionStatus(
  input: PromotionStatusInput
): Promise<Promotion> {
  const result = await updateStatusCallable(input);
  return result.data.promotion;
}

export async function validatePromotionCode(
  input: ValidatePromotionCodeInput
): Promise<PromotionValidationResult> {
  const result = await validateCodeCallable(input);
  return result.data;
}

export async function deletePromotion(
  promotionId: string
): Promise<void> {
  await deletePromotionCallable({
    promotionId,
  });
}
