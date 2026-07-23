import {
  getAccessToken,
} from "@/firebase/auth-token";

const SESSION_ENDPOINT =
 "/api/auth/session";

export interface SessionResponse {
  authenticated: boolean;
  expiresAt: string | null;
}

async function parseSessionResponse(
  response: Response
): Promise<SessionResponse> {
  if (!response.ok) {
    const message =
      await response.text();

        throw new Error(
          message ||
           "Unable to update the authentication session."
        );
    }

    return response.json() as Promise<SessionResponse>;
}

export async function createServerSession(): Promise<SessionResponse> {
 const idToken =
  await getAccessToken(true);

    const response = await fetch(
     SESSION_ENDPOINT,
     {
       method: "POST",

          headers: {
            "Content-Type":
             "application/json",
          },

          credentials: "include",

          cache: "no-store",

          body: JSON.stringify({
            idToken,
          }),
      }
    );

    return parseSessionResponse(response);
}

export async function deleteServerSession(): Promise<SessionResponse> {
 const response = await fetch(
  SESSION_ENDPOINT,
  {
    method: "DELETE",

          credentials: "include",

          cache: "no-store",
      }
    );

    return parseSessionResponse(response);
}

export async function readServerSession(): Promise<SessionResponse> {
 const response = await fetch(
  SESSION_ENDPOINT,
  {
    method: "GET",

          credentials: "include",

          cache: "no-store",
      }
    );

  return parseSessionResponse(response);
}
