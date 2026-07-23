import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
  type Unsubscribe,
} from "firebase/messaging";

import { firebaseApp } from "@/firebase/client";
import { logger } from "@/lib/logger";

let messagingInstance: Messaging | null = null;
let initializationPromise: Promise<Messaging | null> | null = null;

async function initializeFirebaseMessaging(): Promise<Messaging | null> {
 if (messagingInstance) {
   return messagingInstance;
 }

    if (initializationPromise) {
      return initializationPromise;
    }

    initializationPromise = (async () => {
      if (
        typeof window === "undefined" ||
        process.env.NODE_ENV === "test"
      ){
        return null;

     }

     try {
       const supported = await isSupported();

         if (!supported) {
           logger.warn(
             "Firebase Cloud Messaging is not supported in this browser."
           );

             return null;
         }

         messagingInstance = getMessaging(firebaseApp);

       return messagingInstance;
     } catch (error) {
       logger.error(
         "Firebase Cloud Messaging initialization failed.",
         error
       );

         return null;
      }
    })();

    return initializationPromise;
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  return initializeFirebaseMessaging();
}

export async function requestNotificationToken(): Promise<string | null> {
 const messaging = await getFirebaseMessaging();

    if (!messaging || typeof window === "undefined") {
      return null;
    }

    const vapidKey =
     process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim();

    if (!vapidKey) {

        logger.error(
          "NEXT_PUBLIC_FIREBASE_VAPID_KEY is required for push notifications."
        );

        return null;
    }

    try {
      const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          return null;
        }

        const registration =
         await navigator.serviceWorker.register(
           "/firebase-messaging-sw.js",
           {
             scope: "/",
           }
         );

      return await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });
    } catch (error) {
      logger.error(
        "Unable to create Firebase Messaging token.",
        error
      );

        return null;
    }
}

export async function revokeNotificationToken(): Promise<boolean> {
 const messaging = await getFirebaseMessaging();

    if (!messaging) {
      return false;
    }

    try {

      return await deleteToken(messaging);
    } catch (error) {
      logger.error(
        "Unable to revoke Firebase Messaging token.",
        error
      );

        return false;
    }
}

export async function subscribeToForegroundMessages(
  listener: (payload: MessagePayload) => void
): Promise<Unsubscribe> {
  const messaging = await getFirebaseMessaging();

    if (!messaging) {
      return () => undefined;
    }

  return onMessage(messaging, listener);
}
