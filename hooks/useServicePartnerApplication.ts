"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getServicePartnerApplication,
} from "@/services/servicePartnerService";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface UseServicePartnerApplicationOptions {
  readonly enabled?: boolean;
}

interface UseServicePartnerApplicationResult {
  readonly application: ServicePartnerApplication | null;
  readonly loading: boolean;
  readonly refreshing: boolean;
  readonly notFound: boolean;
  readonly error: Error | null;
  readonly reload: () => Promise<void>;
  readonly replaceApplication: (
    application: ServicePartnerApplication
  ) => void;
  readonly clear: () => void;
}

export function useServicePartnerApplication(
  applicationId:
    | string
    | null
    | undefined,
  {
    enabled = true,
  }: UseServicePartnerApplicationOptions = {}
): UseServicePartnerApplicationResult {
  const [
    application,
    setApplication,
  ] = useState<ServicePartnerApplication | null>(
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
          !applicationId?.trim()
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
            await getServicePartnerApplication(
              applicationId
            );

          if (
            sequence !==
            requestSequence.current
          ) {
            return;
          }

          setApplication(result);
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
                  "Unable to load the service partner application."
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
        applicationId,
        enabled,
      ]
    );

  const reload =
    useCallback(
      async (): Promise<void> => {
        await load("refresh");
      },
      [load]
    );

  const replaceApplication =
    useCallback(
      (
        updatedApplication: ServicePartnerApplication
      ): void => {
        setApplication(
          updatedApplication
        );
        setNotFound(false);
      },
      []
    );

  const clear =
    useCallback((): void => {
      requestSequence.current += 1;
      setApplication(null);
      setLoading(false);
      setRefreshing(false);
      setNotFound(false);
      setError(null);
    }, []);

  useEffect(() => {
    if (
      !enabled ||
      !applicationId?.trim()
    ) {
      clear();
      return;
    }

    void load();
  }, [
    applicationId,
    clear,
    enabled,
    load,
  ]);

  return {
    application,
    loading,
    refreshing,
    notFound,
    error,
    reload,
    replaceApplication,
    clear,
  };
}
