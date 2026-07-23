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
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { db } from "@/firebase/client";
import { callableFunction } from "@/firebase/functions";
import type {
  AdjustGiftCardBalanceInput,
  PurchaseGiftCardInput,
  RedeemGiftCardInput,
  ValidateGiftCardInput,
} from "@/lib/schemas/gift-card";
import type {
  GiftCard,
  GiftCardDesign,
  GiftCardTransaction,
} from "@/types/gift-card";

interface GiftCardPurchaseResponse {
  readonly giftCard: GiftCard;
  readonly gatewayOrderId: string;
  readonly amountPaise: number;
  readonly currency: "INR";
  readonly publicKey: string;
}

export interface GiftCardValidationResult {
  readonly valid: boolean;
  readonly giftCardId?: string;
  readonly balancePaise: number;
  readonly expiresAt?: string;
  readonly message: string;
}

export interface GiftCardRedemptionResult {
  readonly giftCard: GiftCard;
  readonly appliedAmountPaise: number;
}

const purchaseGiftCardCallable = callableFunction<
  PurchaseGiftCardInput,
  GiftCardPurchaseResponse
>("purchaseGiftCard");

const validateGiftCardCallable = callableFunction<
  ValidateGiftCardInput,
  GiftCardValidationResult
>("validateGiftCard");

const redeemGiftCardCallable = callableFunction<
  RedeemGiftCardInput,
  GiftCardRedemptionResult
>("redeemGiftCard");

const adjustGiftCardCallable = callableFunction<
  AdjustGiftCardBalanceInput,
  {
    readonly giftCard: GiftCard;
    readonly transaction: GiftCardTransaction;
  }
>("adjustGiftCardBalance");

const disableGiftCardCallable = callableFunction<
  {
    readonly giftCardId: string;
    readonly reason: string;
  },
  {
    readonly giftCard: GiftCard;
  }
>("disableGiftCard");

export async function getGiftCard(
  giftCardId: string
): Promise<GiftCard | null> {
  const snapshot = await getDoc(
    doc(db, "giftCards", giftCardId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as GiftCard;
}

export async function getCustomerGiftCards(input: {
  readonly customerId: string;
  readonly pageSize?: number;
  readonly cursor?: QueryDocumentSnapshot<DocumentData> | null;
}): Promise<{
  readonly giftCards: readonly GiftCard[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}> {
  const pageSize = Math.min(
    Math.max(input.pageSize ?? 20, 1),
    50
  );

  const constraints = [
    where("purchaserId", "==", input.customerId),
    orderBy("createdAt", "desc"),
    ...(input.cursor ? [startAfter(input.cursor)] : []),
    limit(pageSize + 1),
  ];

  const snapshot = await getDocs(
    query(collection(db, "giftCards"), ...constraints)
  );

  const documents = snapshot.docs.slice(0, pageSize);

  return {
    giftCards: documents.map(
      (giftCardDocument) =>
        ({
          id: giftCardDocument.id,
          ...giftCardDocument.data(),
        }) as GiftCard
    ),
    cursor: documents.at(-1) ?? null,
    hasMore: snapshot.docs.length > pageSize,
  };
}

export async function getGiftCardDesigns(): Promise<
  readonly GiftCardDesign[]
> {
  const snapshot = await getDocs(
    query(
      collection(db, "giftCardDesigns"),
      where("active", "==", true),
      orderBy("name", "asc")
    )
  );

  return snapshot.docs.map(
    (designDocument) =>
      ({
        id: designDocument.id,
        ...designDocument.data(),
      }) as GiftCardDesign
  );
}

export async function getGiftCardTransactions(
  giftCardId: string
): Promise<readonly GiftCardTransaction[]> {
  const snapshot = await getDocs(
    query(
      collection(
        db,
        "giftCards",
        giftCardId,
        "transactions"
      ),
      orderBy("createdAt", "desc"),
      limit(250)
    )
  );

  return snapshot.docs.map(
    (transactionDocument) =>
      ({
        id: transactionDocument.id,
        ...transactionDocument.data(),
      }) as GiftCardTransaction
  );
}

export async function purchaseGiftCard(
  input: PurchaseGiftCardInput
): Promise<GiftCardPurchaseResponse> {
  const result = await purchaseGiftCardCallable(input);
  return result.data;
}

export async function validateGiftCard(
  input: ValidateGiftCardInput
): Promise<GiftCardValidationResult> {
  const result = await validateGiftCardCallable(input);
  return result.data;
}

export async function redeemGiftCard(
  input: RedeemGiftCardInput
): Promise<GiftCardRedemptionResult> {
  const result = await redeemGiftCardCallable(input);
  return result.data;
}

export async function adjustGiftCardBalance(
  input: AdjustGiftCardBalanceInput
): Promise<{
  readonly giftCard: GiftCard;
  readonly transaction: GiftCardTransaction;
}> {
  const result = await adjustGiftCardCallable(input);
  return result.data;
}

export async function disableGiftCard(
  giftCardId: string,
  reason: string
): Promise<GiftCard> {
  const result = await disableGiftCardCallable({
    giftCardId,
    reason: reason.trim(),
  });

  return result.data.giftCard;
}
