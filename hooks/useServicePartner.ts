"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getServicePartner,
} from "@/services/servicePartnerService";
import type {
  ServicePartner,
} from "@/types/service-partner";

interface UseServicePartnerOptions {
  readonly enabled?: boolean;
}

interface UseServicePartnerResult {
  readonly partner: ServicePartner | null;
  readonly loading: boolean;
  readonly refreshing: boolean;
  readonly notFound: boolean;
  readonly error: Error | null;
  readonly reload: () => Promise<void>;
  readonly replacePartner: (
    partner: ServicePartner
  ) => void;
  readonly clear: () => void;
}

export function useServicePartner(
  partnerId:
    | string
    | null
    | undefined,
  {
    enabled = true,
  }: UseServicePartnerOptions = {}
): UseServicePartnerResult {
  const [partner, setPartner] =
    useState<ServicePartner | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [notFound, setNotFound] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  const requestSequence =
    useRef(0);

  const load =
    useCallback(
      async (
        mode:
          | "initial"
          | "refresh" =
          "initial"
      ): Promise<void> => {
        if (
          !enabled ||
          !partnerId?.trim()
        ) {
          return;
        }

        const sequence =
          ++requestSequence.current;

        if (mode === "refresh") {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setNotFound(false);
        setError(null);

        try {
          const result =
            await getServicePartner(
              partnerId
            );

          if (
            sequence !==
            requestSequence.current
          ) {
            return;
          }

          setPartner(result);
          setNotFound(
            result === null
          );
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
                  "Unable to load the service partner."
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
        partnerId,
      ]
    );

  const reload =
    useCallback(
      async (): Promise<void> => {
        await load("refresh");
      },
      [load]
    );

  const replacePartner =
    useCallback(
      (
        updatedPartner: ServicePartner
      ): void => {
        setPartner(
          updatedPartner
        );
        setNotFound(false);
      },
      []
    );

  const clear =
    useCallback((): void => {
      requestSequence.current += 1;
      setPartner(null);
      setLoading(false);
      setRefreshing(false);
      setNotFound(false);
      setError(null);
    }, []);

  useEffect(() => {
    if (
      !enabled ||
      !partnerId?.trim()
    ) {
      clear();
      return;
    }

    void load();
  }, [
    clear,
    enabled,
    load,
    partnerId,
  ]);

  return {
    partner,
    loading,
    refreshing,
    notFound,
    error,
    reload,
    replacePartner,
    clear,
  };
}
