import {
  doc,
  getDocFromServer,
} from "firebase/firestore";

import { getFirebaseAuth } from "@/firebase/auth";
import { getFirebaseFirestore } from "@/firebase/firestore";
import { getFirebaseStorage } from "@/firebase/storage";

export interface FirebaseHealthStatus {
  app: boolean;
  auth: boolean;
  firestore: boolean;
  storage: boolean;
  checkedAt: string;
}

export async function checkFirebaseHealth(): Promise<FirebaseHealthStatus> {
 const status: FirebaseHealthStatus = {
   app: true,
   auth: false,
   firestore: false,
   storage: false,
   checkedAt: new Date().toISOString(),
 };

 try {
   await getFirebaseAuth();
   status.auth = true;
 } catch {
   status.auth = false;
 }

 try {
   getFirebaseStorage();
   status.storage = true;
 } catch {
   status.storage = false;
 }

 try {
   const reference = doc(
     getFirebaseFirestore(),
     "settings",
     "health"
   );

  await getDocFromServer(reference);

      status.firestore = true;
    } catch {
      status.firestore = false;
    }

    return status;
}
