import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  adminAuth,
} from "@/firebase/index.server";

import {
  clearSessionCookie,
  getSessionCookie,
  setSessionCookie,
} from "@/firebase/session-cookie.server";

import {
  SESSION_COOKIE,
} from "@/firebase/session-constants";

import {
  verifySessionCookie,
} from "@/firebase/verify-session.server";

interface CreateSessionBody {
  idToken?: unknown;

}

function noStoreJson(
  body: Record<string, unknown>,
  status = 200
): NextResponse {
  return NextResponse.json(
   body,
   {
     status,

          headers: {
           "Cache-Control":
            "private, no-store, max-age=0",

           Pragma:
            "no-cache",

            "X-Content-Type-Options":
             "nosniff",
          },
      }
    );
}

export async function GET(): Promise<NextResponse> {
 const sessionCookie =
  await getSessionCookie();

    if (!sessionCookie) {
      return noStoreJson({
        authenticated: false,

          expiresAt: null,
        });
    }

    try {
      const session =
       await verifySessionCookie(
         sessionCookie
       );

        return noStoreJson({

         authenticated: true,

         expiresAt:
          new Date(
            session.expiresAt * 1000
          ).toISOString(),

         user: {
          uid:
           session.uid,

          email:
           session.email,

          displayName:
           session.displayName,

          emailVerified:
           session.emailVerified,

          role:
           session.role,

          studioId:
           session.studioId,
        },
      });
    } catch {
      await clearSessionCookie();

        return noStoreJson({
         authenticated: false,

          expiresAt: null,
        });
    }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  let body: CreateSessionBody;

    try {

  body =
   (await request.json()) as CreateSessionBody;
} catch {
  return noStoreJson(
   {
     authenticated: false,

        message:
         "Invalid request body.",
      },
      400
    );
}

if (
  typeof body.idToken !==
     "string" ||
  body.idToken.trim().length ===
     0
){
  return noStoreJson(
     {
       authenticated: false,

        message:
         "A valid Firebase ID token is required.",
      },
      400
    );
}

try {
  const decodedIdToken =
   await adminAuth.verifyIdToken(
     body.idToken,
     true
   );

    const currentTimeSeconds =
     Math.floor(
       Date.now() / 1000
     );

    const tokenAgeSeconds =

    currentTimeSeconds -
    decodedIdToken.auth_time;

if (tokenAgeSeconds > 300) {
  return noStoreJson(
    {
      authenticated: false,

        message:
         "Recent authentication is required.",
      },
      401
    );
}

const sessionCookie =
 await adminAuth.createSessionCookie(
   body.idToken,
   {
     expiresIn:
      SESSION_COOKIE.MAX_AGE_SECONDS *
      1000,
   }
 );

await setSessionCookie(
  sessionCookie
);

return noStoreJson({
 authenticated: true,

    expiresAt:
      new Date(
        Date.now() +
         SESSION_COOKIE.MAX_AGE_SECONDS *
           1000
      ).toISOString(),
  });
} catch {
  await clearSessionCookie();

return noStoreJson(
 {

          authenticated: false,

            message:
             "Unable to create a secure session.",
          },
          401
        );
    }
}

export async function DELETE(): Promise<NextResponse> {
 const sessionCookie =
  await getSessionCookie();

    if (sessionCookie) {
      try {
        const decodedToken =
         await adminAuth.verifySessionCookie(
           sessionCookie
         );

          await adminAuth.revokeRefreshTokens(
            decodedToken.uid
          );
        } catch {
          // Invalid or expired sessions are cleared below.
        }
    }

    await clearSessionCookie();

    return noStoreJson({
     authenticated: false,

      expiresAt: null,
    });
}
