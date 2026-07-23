import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { callableFunction } from "@/firebase/functions";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { StudioFollower } from "@/types/follower";

interface UpdateStudioFollowCountRequest {
  readonly studioId: string;
  readonly delta: 1 | -1;
}

interface UpdateStudioFollowCountResponse {
  readonly followerCount: number;
}

const updateFollowerCountCallable =
 callableFunction<
  UpdateStudioFollowCountRequest,

  UpdateStudioFollowCountResponse
 >("updateStudioFollowerCount");

const firestore = getFirebaseFirestore();

function followerDocumentId(
  studioId: string,
  userId: string
): string {
  return `${studioId}_${userId}`;
}

function followerReference(
  studioId: string,
  userId: string
){
  return doc(
    firestore,
    COLLECTIONS.STUDIO_FOLLOWERS,
    followerDocumentId(
      studioId,
      userId
    )
  );
}

export async function followStudio(
  studioId: string,
  userId: string
): Promise<number> {
  const reference =
   followerReference(
     studioId,
     userId
   );

 const existing =
  await getDoc(reference);

 if (existing.exists()) {
   const result =
     await updateFollowerCountCallable(
      {
        studioId,

               delta: 1,
           }
         );

        return result.data.followerCount;
    }

    await setDoc(reference, {
      studioId,
      userId,
      notificationsEnabled: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const result =
     await updateFollowerCountCallable(
       {
         studioId,
         delta: 1,
       }
     );

    return result.data.followerCount;
}

export async function unfollowStudio(
  studioId: string,
  userId: string
): Promise<number> {
  await deleteDoc(
    followerReference(
      studioId,
      userId
    )
  );

    const result =
     await updateFollowerCountCallable(
       {
         studioId,
         delta: -1,
       }
     );

    return result.data.followerCount;
}

export async function getStudioFollowStatus(
  studioId: string,
  userId: string
): Promise<StudioFollower | null> {
  const snapshot = await getDoc(
    followerReference(
      studioId,
      userId
    )
  );

    return snapshot.exists()
     ? ({
         id: snapshot.id,
         ...snapshot.data(),
       } as StudioFollower)
     : null;
}
