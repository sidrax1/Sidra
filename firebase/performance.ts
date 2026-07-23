import {
  getPerformance,
  isSupported,
  trace,
  type Performance,
  type Trace,
} from "firebase/performance";

import { firebaseApp } from "@/firebase/client";
import { logger } from "@/lib/logger";

let performanceInstance: Performance | null = null;
let initializationPromise: Promise<Performance | null> | null = null;

async function initializePerformance(): Promise<Performance | null> {
 if (performanceInstance) {
   return performanceInstance;
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
         return null;
       }

       performanceInstance = getPerformance(firebaseApp);

       return performanceInstance;
     } catch (error) {
       logger.error(
         "Firebase Performance initialization failed.",
         error
       );

       return null;
      }
    })();

    return initializationPromise;
}

export async function getFirebasePerformance(): Promise<Performance | null> {
  return initializePerformance();
}

export async function startTrace(
  name: string
): Promise<Trace | null> {
  const performance = await getFirebasePerformance();

 if (!performance) {
   return null;
 }

 const performanceTrace = trace(performance, name);

 await performanceTrace.start();

 return performanceTrace;
}
