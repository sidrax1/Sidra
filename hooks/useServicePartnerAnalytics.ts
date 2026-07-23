"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getServicePartnerAnalytics,
} from "@/services/servicePartnerService";
import type {
  ServicePartnerAnalytics,
} from "@/types/service-partner";

interface ServicePartnerAnalyticsFilters {
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly state?: string;
}

interface UseServicePartnerAnalyticsOptions
  extends ServicePartnerAnalyticsFilters {
  readonly enabled?: boolean;
}

interface UseServicePartnerAnalyticsResult {
  readonly analytics: ServicePartnerAnalytics | null;
  readonly loading: boolean;
  readonly refreshing: boolean;
  readonly error: Error | null;
  readonly reload: () => Promise<void>;
  readonly clear: () => void;
}

export function useServicePartnerAnalytics({
  dateFrom,
  dateTo,
  enabled = true,
  state,
}: UseServicePartnerAnalyticsOptions = {}): UseServicePartnerAnalyticsResult {
  const [
    analytics,
    setAnalytics,
  ] = useState<ServicePartnerAnalytics | null>(
    null
  );

  const [loading, setLoading] =
    useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  const requestSequence =
    useRef(0);

  const filters =
    useMemo(
      () => ({
        dateFrom:
          dateFrom?.trim() ||
          undefined,
        dateTo:
          dateTo?.trim() ||
          undefined,
        state:
          state?.trim() ||
          undefined,
      }),
      [
        dateFrom,
        dateTo,
        state,
      ]
    );

  const serializedFilters =
    useMemo(
      () =>
        JSON.stringify(filters),
      [filters]
    );

  const load =
    useCallback(
      async (
        mode:
          | "initial"
          | "refresh" =
          "initial"
      ): Promise<void> => {
        if (!enabled) {
          return;
        }

        const sequence =
          ++requestSequence.current;

        if (mode === "refresh") {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        try {
          const result =
            await getServicePartnerAnalytics(
              filters
            );

          if (
            sequence !==
            requestSequence.current
          ) {
            return;
          }

          setAnalytics(result);
        } catch (caughtError) {
          if (
            sequence !==
            requestSequence.current
          ) {
            return;
          }

          setError(
            caughtError instanceof
              Error
              ? caughtError
              : new Error(
                  "Unable to load service partner analytics."
                )
          );
        } finally {
          if (
            sequence ===
            requestSequence.current
          ) {
            setLoading(false);
            setRefreshing(false);
          }
        }
      },
      [
        enabled,
        filters,
      ]
    );

  const reload =
    useCallback(
      async (): Promise<void> => {
        await load("refresh");
      },
      [load]
    );

  const clear =
    useCallback((): void => {
      requestSequence.current += 1;
      setAnalytics(null);
      setLoading(false);
      setRefreshing(false);
      setError(null);
    }, []);

  useEffect(() => {
    if (!enabled) {
      clear();
      return;
    }

    void load();
  }, [
    clear,
    enabled,
    load,
    serializedFilters,
  ]);

  return {
    analytics,
    loading,
    refreshing,
    error,
    reload,
    clear,
  };
}
