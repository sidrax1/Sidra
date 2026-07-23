import { getIdToken } from "firebase/auth";

import { getCurrentFirebaseUser } from "@/firebase/auth-state";

export async function getAccessToken(
  forceRefresh = false
): Promise<string> {
  const user =
   await getCurrentFirebaseUser();

    if (!user) {
      throw new Error(
        "Authentication required."
      );
    }

    return getIdToken(
      user,
      forceRefresh
    );
}

export async function getAuthorizationHeader(): Promise<{
 Authorization: string;
}> {
 const token =
   await getAccessToken();

    return {
      Authorization: `Bearer ${token}`,
    };
}
