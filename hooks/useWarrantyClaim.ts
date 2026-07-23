"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getWarrantyClaim,
  getWarrantyClaimTimeline,
} from "@/services/warrantyService";
import type {
  WarrantyClaim,
  WarrantyTimelineEvent,
} from "@/types/warranty";

interface UseWarrantyClaimOptions {
  readonly enabled?: boolean;
  readonly includeTimeline?: boolean;
}

interface UseWarrantyClaimResult {
  readonly claim: WarrantyClaim | null;
  readonly timeline: readonly WarrantyTimelineEvent[];
  readonly loading: boolean;
  readonly refreshing: boolean;
  readonly error: Error | null;
  readonly notFound: boolean;
  readonly reload: () => Promise<void>;
  readonly replaceClaim: (
    claim: WarrantyClaim
  ) => void;
  readonly clear: () => void;
}

export function useWarrantyClaim(
  claimId: string | null | undefined,
  {
    enabled = true,
    includeTimeline = true,
  }: UseWarrantyClaimOptions = {}
): UseWarrantyClaimResult {
  const [claim, setClaim] =
    useState<WarrantyClaim | null>(
      null
    );

  const [timeline, setTimeline] =
    useState<
      readonly WarrantyTimelineEvent[]
    >([]);

  const [loading, setLoading] =
    useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  const [notFound, setNotFound] =
    useState(false);

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
          !claimId?.trim()
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

        setError(null);
        setNotFound(false);

        try {
          const [
            claimResult,
            timelineResult,
          ] = await Promise.all([
            getWarrantyClaim(
              claimId
            ),
            includeTimeline
              ? getWarrantyClaimTimeline(
                  claimId
                )
              : Promise.resolve(
                  [] as const
                ),
          ]);

          if (
            sequence !==
            requestSequence.current
          ) {
            return;
          }

          setClaim(claimResult);
          setTimeline(
            timelineResult
          );
          setNotFound(
            claimResult === null
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
                  "Unable to load the warranty claim."
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
        claimId,
        enabled,
        includeTimeline,
      ]
    );

  const reload =
    useCallback(
      async (): Promise<void> => {
        await load("refresh");
      },
      [load]
    );

  const replaceClaim =
    useCallback(
      (
        updatedClaim: WarrantyClaim
      ): void => {
        setClaim(updatedClaim);
        setNotFound(false);
      },
      []
    );

  const clear =
    useCallback((): void => {
      requestSequence.current += 1;
      setClaim(null);
      setTimeline([]);
      setLoading(false);
      setRefreshing(false);
      setError(null);
      setNotFound(false);
    }, []);

  useEffect(() => {
    if (
      !enabled ||
      !claimId?.trim()
    ) {
      clear();
      return;
    }

    void load();
  }, [
    claimId,
    clear,
    enabled,
    load,
  ]);

  return {
    claim,
    timeline,
    loading,
    refreshing,
    error,
    notFound,
    reload,
    replaceClaim,
    clear,
  };
}
