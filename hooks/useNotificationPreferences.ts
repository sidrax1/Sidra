"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { AccountNotificationPreferencesInput } from "@/lib/schemas/account";
import {
  getAccountNotificationPreferences,
  updateAccountNotificationPreferences,
} from "@/services/accountService";
import type { AccountNotificationPreferences } from "@/types/account";

interface UseNotificationPreferencesResult {
  readonly preferences: AccountNotificationPreferences | null;
  readonly loading: boolean;
  readonly saving: boolean;
  readonly error: Error | null;
  readonly refresh: () => Promise<void>;
  readonly update: (
    input: AccountNotificationPreferencesInput
  ) => Promise<void>;
}

export function useNotificationPreferences(
  userId: string | null | undefined
): UseNotificationPreferencesResult {
  const [
    preferences,
    setPreferences,
  ] =
    useState<AccountNotificationPreferences | null>(
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
        setPreferences(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const nextPreferences =
          await getAccountNotificationPreferences(
            userId
          );

        setPreferences(
          nextPreferences
        );
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason
            : new Error(
                "Unable to load notification preferences."
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
        input: AccountNotificationPreferencesInput
      ) => {
        if (!userId) {
          throw new Error(
            "Authentication is required."
          );
        }

        setSaving(true);
        setError(null);

        try {
          await updateAccountNotificationPreferences(
            userId,
            input
          );

          await refresh();
        } catch (reason) {
          const resolvedError =
            reason instanceof Error
              ? reason
              : new Error(
                  "Unable to update notification preferences."
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
    preferences,
    loading,
    saving,
    error,
    refresh,
    update,
  };
}
