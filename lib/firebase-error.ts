import {
  FirebaseError
} from "firebase/app";

export interface ParsedFirebaseError {
 code: string;

    message: string;

    retryable: boolean;
}

export function parseFirebaseError(
  error: unknown
): ParsedFirebaseError {
  if (error instanceof FirebaseError) {
    return {
      code: error.code,
      message: error.message,
      retryable:
       error.code.includes("unavailable") ||
       error.code.includes("deadline-exceeded")
    };
  }

    if (error instanceof Error) {
      return {
        code: "unknown",
        message: error.message,
        retryable: false
      };
    }

    return {
      code: "unknown",
      message: "Unknown error occurred.",
      retryable: false
    };
}
