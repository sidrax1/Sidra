import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { Cart, CartItem } from "@/types/cart";

function cartReference(userId: string) {
  return doc(getFirebaseFirestore(), COLLECTIONS.CARTS, userId);
}

export async function getCart(
  userId: string
): Promise<Cart | null> {
  const snapshot = await getDoc(cartReference(userId));

    return snapshot.exists()
     ? (snapshot.data() as Cart)
     : null;
}

export async function setCartItems(
  userId: string,
  items: readonly CartItem[]
): Promise<void> {
  const totalItems = items.reduce(
    (total, item) => total + item.quantity,

      0
    );

    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await setDoc(
      cartReference(userId),
      {
        userId,
        items,
        totalItems,
        subtotal,
        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      }
    );
}

export async function clearCart(
  userId: string
): Promise<void> {
  await updateDoc(cartReference(userId), {
    items: [],
    totalItems: 0,
    subtotal: 0,
    updatedAt: serverTimestamp(),
  });
}
