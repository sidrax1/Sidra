import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { Notification } from "@/types/notification";

const firestore = getFirebaseFirestore();

function notificationReference(notificationId: string) {
 return doc(
  firestore,
  COLLECTIONS.NOTIFICATIONS,

      notificationId
    );
}

export async function getUserNotifications(
  userId: string,
  maximumResults = 20
): Promise<Notification[]> {
  if (!userId.trim()) {
    throw new Error("A valid user ID is required.");
  }

    if (
      !Number.isInteger(maximumResults) ||
      maximumResults < 1 ||
      maximumResults > 100
    ){
      throw new RangeError(
         "maximumResults must be between 1 and 100."
      );
    }

    const snapshot = await getDocs(
      query(
        collection(
          firestore,
          COLLECTIONS.NOTIFICATIONS
        ),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(maximumResults)
      )
    );

    return snapshot.docs.map(
      (notificationDocument) =>
       ({
         id: notificationDocument.id,
         ...notificationDocument.data(),
       }) as Notification
    );
}

export async function getUnreadNotifications(

  userId: string,
  maximumResults = 20
): Promise<Notification[]> {
  const snapshot = await getDocs(
    query(
      collection(
        firestore,
        COLLECTIONS.NOTIFICATIONS
      ),
      where("userId", "==", userId),
      where("read", "==", false),
      orderBy("createdAt", "desc"),
      limit(maximumResults)
    )
  );

    return snapshot.docs.map(
      (notificationDocument) =>
       ({
         id: notificationDocument.id,
         ...notificationDocument.data(),
       }) as Notification
    );
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  await updateDoc(
    notificationReference(notificationId),
    {
      read: true,
      readAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}

export async function markNotificationAsUnread(
  notificationId: string
): Promise<void> {
  await updateDoc(
   notificationReference(notificationId),
   {

       read: false,
       readAt: null,
       updatedAt: serverTimestamp(),
   }
 );
}
