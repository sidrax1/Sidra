import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { Wishlist } from "@/types/wishlist";

function wishlistReference(userId: string) {
  return doc(
    getFirebaseFirestore(),
    COLLECTIONS.WISHLISTS,
    userId
  );
}

export async function getWishlist(
  userId: string
): Promise<Wishlist | null> {
  const snapshot = await getDoc(wishlistReference(userId));

 if (!snapshot.exists()) {
   return null;
 }

    return snapshot.data() as Wishlist;
}

export async function addWishlistItem(
  userId: string,
  productId: string
): Promise<void> {
  const reference = wishlistReference(userId);
  const snapshot = await getDoc(reference);

    if (!snapshot.exists()) {
      await setDoc(reference, {
        userId,
        items: [
          {
            productId,
            addedAt: new Date().toISOString(),
          },
        ],
        totalItems: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

        return;
    }

    await updateDoc(reference, {
      items: arrayUnion({
        productId,
        addedAt: new Date().toISOString(),
      }),
      updatedAt: serverTimestamp(),
    });
}

export async function removeWishlistItem(
  userId: string,
  item: {
    productId: string;
    addedAt: string;
  }
): Promise<void> {

    await updateDoc(wishlistReference(userId), {
      items: arrayRemove(item),
      updatedAt: serverTimestamp(),
    });
}
