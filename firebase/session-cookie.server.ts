import "server-only";

import {
  cookies,
} from "next/headers";

import {
  SESSION_COOKIE,
} from "@/firebase/session-constants";

export async function getSessionCookie(): Promise<
 string | null
>{
 const cookieStore = await cookies();

    return (
      cookieStore.get(
       SESSION_COOKIE.NAME
      )?.value ?? null
    );
}

export async function setSessionCookie(
  sessionCookie: string
): Promise<void> {
  const normalizedSessionCookie =
   sessionCookie.trim();

    if (!normalizedSessionCookie) {
      throw new Error(
        "A valid session cookie is required."
      );
    }

    const cookieStore = await cookies();

    cookieStore.set(

     SESSION_COOKIE.NAME,
     normalizedSessionCookie,
     {
       httpOnly:
        SESSION_COOKIE.HTTP_ONLY,

          secure:
           SESSION_COOKIE.SECURE,

          sameSite:
           SESSION_COOKIE.SAME_SITE,

          maxAge:
           SESSION_COOKIE.MAX_AGE_SECONDS,

          path:
           SESSION_COOKIE.PATH,
      }
    );
}

export async function clearSessionCookie(): Promise<void> {
 const cookieStore = await cookies();

    cookieStore.set(
     SESSION_COOKIE.NAME,
     "",
     {
       httpOnly:
         SESSION_COOKIE.HTTP_ONLY,

          secure:
           SESSION_COOKIE.SECURE,

          sameSite:
           SESSION_COOKIE.SAME_SITE,

          maxAge: 0,

          expires: new Date(0),

          path:
           SESSION_COOKIE.PATH,
     }

    );
}
