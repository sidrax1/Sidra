import { NextResponse } from "next/server";

export function successResponse<T>(
  data: T,
  status = 200
): NextResponse {
  return NextResponse.json(
   {
     success: true,
     data,
   },
   {
     status,
     headers: {
       "Cache-Control": "private, no-store, max-age=0",
       "X-Content-Type-Options": "nosniff",
     },

      }
    );
}

export function errorResponse(
  code: string,
  message: string,
  status = 500,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details === undefined ? {} : { details }),
      },
    },
    {
      status,
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
