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
  InventoryAdjustmentInput,
  InventoryDamageInput,
  InventoryRestockInput,
  InventorySettingsInput,
} from "@/lib/schemas/inventory";
import type {
  InventoryMovement,
  InventoryRecord,
  InventoryStatus,
} from "@/types/inventory";

interface InventoryMutationResponse {
  readonly inventory: InventoryRecord;
  readonly movement: InventoryMovement;
}

interface InventoryPage {
  readonly records: readonly InventoryRecord[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

const adjustInventoryCallable = callableFunction<
  InventoryAdjustmentInput,
  InventoryMutationResponse
>("adjustInventory");

const updateSettingsCallable = callableFunction<
  InventorySettingsInput,
  { readonly inventory: InventoryRecord }
>("updateInventorySettings");

const restockInventoryCallable = callableFunction<
  InventoryRestockInput,
  InventoryMutationResponse
>("restockInventory");

const damageInventoryCallable = callableFunction<
  InventoryDamageInput,
  InventoryMutationResponse
>("recordDamagedInventory");

export async function getInventoryRecord(
  inventoryId: string
): Promise<InventoryRecord | null> {
  const snapshot = await getDoc(
    doc(db, "inventory", inventoryId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as InventoryRecord;
}

export async function getProductInventory(
  productId: string
): Promise<InventoryRecord | null> {
  const snapshot = await getDocs(
    query(
      collection(db, "inventory"),
      where("productId", "==", productId),
      limit(1)
    )
  );

  const document = snapshot.docs.at(0);

  return document
    ? ({
        id: document.id,
        ...document.data(),
      } as InventoryRecord)
    : null;
}

export async function getStudioInventory(input: {
  readonly studioId: string;
  readonly statuses?: readonly InventoryStatus[];
  readonly pageSize?: number;
  readonly cursor?: QueryDocumentSnapshot<DocumentData> | null;
}): Promise<InventoryPage> {
  const pageSize = Math.min(
    Math.max(input.pageSize ?? 25, 1),
    50
  );

  const constraints: QueryConstraint[] = [
    where("studioId", "==", input.studioId),
  ];

  if (input.statuses?.length) {
    constraints.push(
      where(
        "status",
        "in",
        input.statuses.slice(0, 10)
      )
    );
  }

  constraints.push(orderBy("updatedAt", "desc"));

  if (input.cursor) {
    constraints.push(startAfter(input.cursor));
  }

  constraints.push(limit(pageSize + 1));

  const snapshot = await getDocs(
    query(collection(db, "inventory"), ...constraints)
  );

  const documents = snapshot.docs.slice(0, pageSize);

  return {
    records: documents.map(
      (document) =>
        ({
          id: document.id,
          ...document.data(),
        }) as InventoryRecord
    ),
    cursor: documents.at(-1) ?? null,
    hasMore: snapshot.docs.length > pageSize,
  };
}

export async function getInventoryMovements(
  inventoryId: string
): Promise<readonly InventoryMovement[]> {
  const snapshot = await getDocs(
    query(
      collection(
        db,
        "inventory",
        inventoryId,
        "movements"
      ),
      orderBy("createdAt", "desc"),
      limit(100)
    )
  );

  return snapshot.docs.map(
    (document) =>
      ({
        id: document.id,
        ...document.data(),
      }) as InventoryMovement
  );
}

export async function adjustInventory(
  input: InventoryAdjustmentInput
): Promise<InventoryMutationResponse> {
  const result = await adjustInventoryCallable(input);
  return result.data;
}

export async function updateInventorySettings(
  input: InventorySettingsInput
): Promise<InventoryRecord> {
  const result = await updateSettingsCallable(input);
  return result.data.inventory;
}

export async function restockInventory(
  input: InventoryRestockInput
): Promise<InventoryMutationResponse> {
  const result = await restockInventoryCallable(input);
  return result.data;
}

export async function recordDamagedInventory(
  input: InventoryDamageInput
): Promise<InventoryMutationResponse> {
  const result = await damageInventoryCallable(input);
  return result.data;
}
