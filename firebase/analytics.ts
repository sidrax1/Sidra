import {
  getAnalytics,
  isSupported,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId,
  setUserProperties,
  type Analytics,
  type CustomParams,
} from "firebase/analytics";

import { firebaseApp } from "@/firebase/client";
import { logger } from "@/lib/logger";

let analyticsInstance: Analytics | null = null;
let initializationPromise: Promise<Analytics | null> | null = null;

async function initializeFirebaseAnalytics(): Promise<Analytics | null> {
 if (analyticsInstance) {
   return analyticsInstance;
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
        "Firebase Analytics is not supported in this browser."
      );

        return null;
    }

    analyticsInstance = getAnalytics(firebaseApp);

    setAnalyticsCollectionEnabled(
      analyticsInstance,
      process.env.NODE_ENV === "production"
    );

    return analyticsInstance;
  } catch (error) {
    logger.error(
      "Firebase Analytics initialization failed.",
      error
    );

        return null;
      }
    })();

    return initializationPromise;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  return initializeFirebaseAnalytics();
}

export async function trackAnalyticsEvent(
  eventName: string,
  parameters?: CustomParams
): Promise<void> {
  const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      return;
    }

    try {
      logEvent(analytics, eventName, parameters);
    } catch (error) {
      logger.error(
        `Failed to track analytics event: ${eventName}`,
        error
      );
    }
}

export async function identifyAnalyticsUser(
  userId: string | null
): Promise<void> {
  const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      return;
    }

    setUserId(analytics, userId);
}

export async function setAnalyticsUserProperties(
  properties: Record<string, string | null>
): Promise<void> {
  const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      return;
    }

  setUserProperties(analytics, properties);
}
