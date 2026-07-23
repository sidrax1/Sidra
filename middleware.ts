import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
 const response = NextResponse.next();

response.headers.set(
  "X-DNS-Prefetch-Control",
  "on"
);

response.headers.set(
  "X-Frame-Options",
  "SAMEORIGIN"
);

response.headers.set(
  "X-Content-Type-Options",
  "nosniff"
);

response.headers.set(
  "Referrer-Policy",
  "strict-origin-when-cross-origin"
);

response.headers.set(
  "Permissions-Policy",
  "camera=(), microphone=(), geolocation=(), payment=()"
);

response.headers.set(
  "Cross-Origin-Opener-Policy",
  "same-origin"
);

response.headers.set(
  "Cross-Origin-Resource-Policy",
  "same-origin"
);

response.headers.set(
  "Cross-Origin-Embedder-Policy",
  "credentialless"
);

response.headers.set(
  "X-Robots-Tag",
  "index,follow"
);

    if (
      process.env.NODE_ENV === "production" &&
      request.nextUrl.protocol === "http:"
    ){
      return NextResponse.redirect(
         `https://${request.nextUrl.host}${request.nextUrl.pathname}${request.nextUrl.search}`,
         308
      );
    }

    return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"
  ]
};
