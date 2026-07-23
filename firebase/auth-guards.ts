import type { User } from "firebase/auth";

export function isAuthenticated(
  user: User | null
): user is User {
  return user !== null;
}

export function isEmailVerified(
  user: User | null
): boolean {
  return !!user?.emailVerified;
}

export function hasProvider(
  user: User | null,
  providerId: string
): boolean {
  if (!user) {
    return false;
  }

    return user.providerData.some(
      (provider) =>
       provider.providerId === providerId
    );
}

export function requireAuthenticatedUser(
  user: User | null
): User {
  if (!user) {
    throw new Error(
      "Authentication required."
    );
  }

  return user;
}
