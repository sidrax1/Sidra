"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getAccountProfile,
  updateAccountProfile,
} from "@/services/accountService";
import type { AccountProfileInput } from "@/lib/schemas/account";
import type { AccountProfile } from "@/types/account";

interface UseAccountProfileResult {
  readonly profile: AccountProfile | null;
  readonly loading: boolean;
  readonly saving: boolean;
  readonly error: Error | null;
  readonly refresh: () => Promise<void>;
  readonly update: (
    input: AccountProfileInput
  ) => Promise<void>;
}

export function useAccountProfile(
  userId: string | null | undefined
): UseAccountProfileResult {
  const [profile, setProfile] =
    useState<AccountProfile | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  const refresh =
    useCallback(async () => {
      if (!userId) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const nextProfile =
          await getAccountProfile(
            userId
          );

        setProfile(nextProfile);
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason
            : new Error(
                "Unable to load account profile."
              )
        );
      } finally {
        setLoading(false);
      }
    }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const update =
    useCallback(
      async (
        input: AccountProfileInput
      ) => {
        if (!userId) {
          throw new Error(
            "Authentication is required."
          );
        }

        setSaving(true);
        setError(null);

        try {
          await updateAccountProfile(
            userId,
            input
          );

          await refresh();
        } catch (reason) {
          const resolvedError =
            reason instanceof Error
              ? reason
              : new Error(
                  "Unable to update account profile."
                );

          setError(resolvedError);
          throw resolvedError;
        } finally {
          setSaving(false);
        }
      },
      [refresh, userId]
    );

  return {
    profile,
    loading,
    saving,
    error,
    refresh,
    update,
  };
}
