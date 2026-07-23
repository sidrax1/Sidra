"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  User as FirebaseUser,
} from "firebase/auth";

import {
  subscribeToIdToken,
} from "@/firebase/auth-state";

import {
  signInWithGoogle,
  signOutUser,
} from "@/firebase/auth-actions";

import {
  createServerSession,
  deleteServerSession,
} from "@/firebase/session-client";

import {
  parseAuthError,
  type AuthErrorDetails,
} from "@/firebase/auth-errors";

import {
  logger,
} from "@/lib/logger";

export interface AuthContextValue {
 user: FirebaseUser | null;

 loading: boolean;

 authenticated: boolean;

    error: AuthErrorDetails | null;

    signIn: () => Promise<void>;

    signOut: () => Promise<void>;

    clearError: () => void;

    refreshSession: () => Promise<void>;
}

export const AuthContext =
 createContext<AuthContextValue | null>(
   null
 );

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps): React.JSX.Element {
  const [
   user,
   setUser,
  ]=
   useState<FirebaseUser | null>(
     null
   );

    const [
     loading,
     setLoading,
    ]=
     useState(true);

    const [
     error,
     setError,
    ]=
     useState<AuthErrorDetails | null>(
      null

 );

const clearError =
 useCallback((): void => {
   setError(null);
 }, []);

const refreshSession =
 useCallback(async (): Promise<void> => {
  if (!user) {
    await deleteServerSession();

      return;
  }

   await createServerSession();
 }, [user]);

const signIn =
 useCallback(async (): Promise<void> => {
  setLoading(true);

  setError(null);

  try {
    await signInWithGoogle();

    await createServerSession();
  } catch (signInError) {
    const parsedError =
     parseAuthError(
       signInError
     );

      setError(parsedError);

     throw signInError;
   } finally {
     setLoading(false);
   }
 }, []);

const signOut =
 useCallback(async (): Promise<void> => {

  setLoading(true);

  setError(null);

  try {
    await Promise.allSettled([
     deleteServerSession(),

      signOutUser(),
    ]);

    setUser(null);
  } catch (signOutError) {
    const parsedError =
     parseAuthError(
       signOutError
     );

    setError(parsedError);

     throw signOutError;
   } finally {
     setLoading(false);
   }
 }, []);

useEffect(() => {
 let active = true;

 let unsubscribe:
   | (() => void)
   | undefined;

 const initialize =
  async (): Promise<void> => {
   try {
     unsubscribe =
      await subscribeToIdToken(
        async (
          nextUser
        ) => {
          if (!active) {
            return;
          }

     setUser(
       nextUser
     );

     if (nextUser) {
       try {
         await createServerSession();
       } catch (
         sessionError
       ){
         logger.error(
           "Unable to synchronize the secure server session.",
           sessionError
         );
       }
     } else {
       await deleteServerSession().catch(
         () =>
           undefined
       );
     }

     if (active) {
       setLoading(
         false
       );
     }
      }
    );
} catch (
  initializationError
){
  if (!active) {
    return;
  }

 setError(
   parseAuthError(
     initializationError
   )
 );

 setLoading(false);

    }
  };

 void initialize();

 return () => {
  active = false;

    unsubscribe?.();
  };
}, []);

const value =
 useMemo<AuthContextValue>(
  () => ({
    user,

    loading,

    authenticated:
     user !== null,

    error,

    signIn,

    signOut,

    clearError,

     refreshSession,
   }),
   [
     user,
     loading,
     error,
     signIn,
     signOut,
     clearError,
     refreshSession,
   ]
 );

return (

   <AuthContext.Provider
    value={value}
   >
    {children}
   </AuthContext.Provider>
 );
}
