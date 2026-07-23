import {
  connectFunctionsEmulator,
  getFunctions,

  httpsCallable,
  type Functions,
} from "firebase/functions";

import { env } from "@/lib/env";
import { firebaseApp } from "@/firebase/client";
import { logger } from "@/lib/logger";

let functions: Functions | null = null;
let emulatorConnected = false;

function initializeFunctions(): Functions {
 if (functions) {
   return functions;
 }

    functions = getFunctions(
      firebaseApp,
      env.FUNCTIONS_REGION
    );

    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" &&
      !emulatorConnected
    ){
      connectFunctionsEmulator(
         functions,
         "127.0.0.1",
         5001
      );

        emulatorConnected = true;

        logger.info("Connected to Firebase Functions Emulator.");
    }

    return functions;
}

export function getFirebaseFunctions(): Functions {
  return initializeFunctions();
}

export function callableFunction<
  Request,
  Response,
>(name: string) {
  return httpsCallable<Request, Response>(
    getFirebaseFunctions(),
    name
  );
}
