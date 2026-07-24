import {
  getPerformance,
  trace,
} from "firebase/performance";

type Performance = ReturnType<typeof getPerformance>;
type Trace = ReturnType<typeof trace>;

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
