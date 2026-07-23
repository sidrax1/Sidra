import type { NextRequest } from "next/server";

export function getRequestIp(
  request: NextRequest
): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");

    if (forwardedFor) {
      return forwardedFor.split(",")[0]?.trim() ?? null;
    }

    return (
      request.headers.get("x-real-ip") ??
      request.headers.get("cf-connecting-ip") ??
      null
    );
}

export function getRequestUserAgent(
  request: NextRequest
): string {
  return request.headers.get("user-agent")?.slice(0, 512) ?? "";
}

export function requireJsonRequest(
  request: NextRequest
): void {
  const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.toLowerCase().includes("application/json")) {
      throw new Error("Content-Type must be application/json.");
    }
}
