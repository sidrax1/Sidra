import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  type AppCheck,
} from "firebase/app-check";

import { firebaseApp } from "@/firebase/client";
import { logger } from "@/lib/logger";

let appCheckInstance: AppCheck | null = null;

function getRecaptchaSiteKey(): string | null {
 const siteKey =
  process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY?.trim();

    return siteKey || null;
}

export function initializeFirebaseAppCheck(): AppCheck | null {
 if (appCheckInstance) {
   return appCheckInstance;
 }

    if (
      typeof window === "undefined" ||
      process.env.NODE_ENV === "test"

){
  return null;
}

const siteKey = getRecaptchaSiteKey();

 if (!siteKey) {
   if (process.env.NODE_ENV === "production") {
     logger.error(
       "Firebase App Check is disabled becauseNEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY is missing."
     );
   }

    return null;
}

try {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN
  ){
    const debugWindow = window as typeof window & {
       FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean;
    };

        debugWindow.FIREBASE_APPCHECK_DEBUG_TOKEN =
         process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN;
    }

    appCheckInstance = initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });

  return appCheckInstance;
} catch (error) {
  logger.error(
    "Firebase App Check initialization failed.",
    error
  );

    return null;
}

}

export function getFirebaseAppCheck(): AppCheck | null {
  return initializeFirebaseAppCheck();
}
