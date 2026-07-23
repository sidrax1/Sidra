import {
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";

import { getFirebaseFirestore } from "@/firebase/firestore";
import { logger } from "@/lib/logger";

export async function enableFirestoreNetwork(): Promise<void> {
 try {
   await enableNetwork(
     getFirebaseFirestore()
   );
 } catch (error) {
   logger.error(
     "Unable to enable Firestore network.",
     error
   );

        throw error;
    }
}

export async function disableFirestoreNetwork(): Promise<void> {
 try {
   await disableNetwork(
     getFirebaseFirestore()
   );
 } catch (error) {
   logger.error(
     "Unable to disable Firestore network.",
     error
   );

        throw error;
    }
}

export function subscribeToBrowserConnectivity(
  listener: (online: boolean) => void
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

 const handleOnline = (): void => {
   listener(true);
 };

 const handleOffline = (): void => {
   listener(false);
 };

 window.addEventListener(
   "online",
   handleOnline
 );

 window.addEventListener(
   "offline",
   handleOffline
 );

 listener(navigator.onLine);

 return () => {
  window.removeEventListener(
    "online",
    handleOnline
  );

   window.removeEventListener(
     "offline",
     handleOffline
   );
 };
}
