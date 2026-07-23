export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

    constructor(
     status: number,
     code: string,
     message: string,
     details?: unknown
    ){
     super(message);

        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

export function normalizeApiError(error: unknown): ApiError {
 if (error instanceof ApiError) {
   return error;
 }

 if (error instanceof Error) {
   return new ApiError(
     500,
     "INTERNAL_ERROR",
     error.message
   );
 }

 return new ApiError(
   500,
   "INTERNAL_ERROR",
   "An unexpected error occurred."
 );
}
