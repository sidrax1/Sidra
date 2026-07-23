import {
  FirebaseError,
} from "firebase/app";

export interface RetryOptions {
  attempts?: number;
  initialDelayMs?: number;
  maximumDelayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (
    error: unknown,
    attempt: number
  ) => boolean;
}

const RETRYABLE_FIREBASE_CODES = new Set([
 "aborted",
 "cancelled",
 "deadline-exceeded",
 "internal",
 "resource-exhausted",
 "unavailable",

  "unknown",
]);

function defaultShouldRetry(
  error: unknown
): boolean {
  if (!(error instanceof FirebaseError)) {
    return false;
  }

    const normalizedCode =
     error.code.includes("/")
      ? error.code.split("/").at(-1) ?? error.code
      : error.code;

    return RETRYABLE_FIREBASE_CODES.has(
      normalizedCode
    );
}

function wait(
  milliseconds: number
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export async function withFirebaseRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    attempts = 3,
    initialDelayMs = 250,
    maximumDelayMs = 4000,
    backoffMultiplier = 2,
    shouldRetry = defaultShouldRetry,
  } = options;

    if (
      !Number.isInteger(attempts) ||
      attempts < 1
    ){

      throw new RangeError(
        "attempts must be a positive integer."
      );
 }

 let delay = initialDelayMs;
 let lastError: unknown;

 for (
  let attempt = 1;
  attempt <= attempts;
  attempt += 1
 ){
  try {
    return await operation();
  } catch (error) {
    lastError = error;

          const retry =
           attempt < attempts &&
           shouldRetry(error, attempt);

          if (!retry) {
            throw error;
          }

          await wait(delay);

          delay = Math.min(
            maximumDelayMs,
            delay * backoffMultiplier
          );
      }
 }

 throw lastError;
}
