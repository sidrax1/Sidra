"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

import {
  getWarrantyClaims,
  type WarrantyClaimFilters,
} from "@/services/warrantyService";
import type {
  WarrantyClaim,
} from "@/types/warranty";

interface UseWarrantyClaimsOptions
  extends Omit<
    WarrantyClaimFilters,
    "cursor"
  > {
  readonly enabled?: boolean;
}

interface UseWarrantyClaimsResult {
  readonly claims: readonly WarrantyClaim[];
  readonly loading: boolean;
  readonly loadingMore: boolean;
  readonly refreshing: boolean;
  readonly error: Error | null;
  readonly hasMore: boolean;
  readonly reload: () => Promise<void>;
  readonly loadMore: () => Promise<void>;
  readonly reset: () => void;
}

export function useWarrantyClaims({
  enabled = true,
  pageSize = 20,
  ...filters
}: UseWarrantyClaimsOptions = {}): UseWarrantyClaimsResult {
  const [claims, setClaims] =
    useState<
      readonly WarrantyClaim[]
    >([]);

  const [cursor, setCursor] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(
      null
    );

  const [hasMore, setHasMore] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  const requestSequence =
    useRef(0);

  const serializedFilters =
    useMemo(
      () =>
        JSON.stringify({
          customerId:
            filters.customerId ??
            null,
          studioId:
            filters.studioId ??
            null,
          warrantyId:
            filters.warrantyId ??
            null,
          statuses:
            filters.statuses
              ? [...filters.statuses]
              : null,
          priorities:
            filters.priorities
              ? [...filters.priorities]
              : null,
          pageSize,
        }),
      [
        filters.customerId,
        filters.priorities,
        filters.statuses,
        filters.studioId,
        filters.warrantyId,
        pageSize,
      ]
    );

  const normalizedFilters =
    useMemo<
      Omit<
        WarrantyClaimFilters,
        "cursor"
      >
    >(
      () => ({
        customerId:
          filters.customerId,
        studioId:
          filters.studioId,
        warrantyId:
          filters.warrantyId,
        statuses:
          filters.statuses,
        priorities:
          filters.priorities,
        pageSize,
      }),
      [
        serializedFilters,
      ]
    );

  const loadInitial =
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
            await getWarrantyClaims(
              normalizedFilters
            );

          if (
            sequence !==
            requestSequence.current
          ) {
            return;
          }

          setClaims(result.claims);
          setCursor(result.cursor);
          setHasMore(
            result.hasMore
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
                  "Unable to load warranty claims."
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
        normalizedFilters,
      ]
    );

  const loadMore =
    useCallback(
      async (): Promise<void> => {
        if (
          !enabled ||
          loading ||
          loadingMore ||
          !hasMore ||
          !cursor
        ) {
          return;
        }

        setLoadingMore(true);
        setError(null);

        try {
          const result =
            await getWarrantyClaims({
              ...normalizedFilters,
              cursor,
            });

          setClaims(
            (currentClaims) => {
              const claimsById =
                new Map(
                  currentClaims.map(
                    (claim) => [
                      claim.id,
                      claim,
                    ]
                  )
                );

              for (const claim of
                result.claims) {
                claimsById.set(
                  claim.id,
                  claim
                );
              }

              return [
                ...claimsById.values(),
              ];
            }
          );

          setCursor(result.cursor);
          setHasMore(
            result.hasMore
          );
        } catch (caughtError) {
          setError(
            caughtError instanceof
              Error
              ? caughtError
              : new Error(
                  "Unable to load more warranty claims."
                )
          );
        } finally {
          setLoadingMore(false);
        }
      },
      [
        cursor,
        enabled,
        hasMore,
        loading,
        loadingMore,
        normalizedFilters,
      ]
    );

  const reload =
    useCallback(
      async (): Promise<void> => {
        await loadInitial(
          "refresh"
        );
      },
      [loadInitial]
    );

  const reset =
    useCallback((): void => {
      requestSequence.current += 1;
      setClaims([]);
      setCursor(null);
      setHasMore(false);
      setError(null);
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }, []);

  useEffect(() => {
    if (!enabled) {
      reset();
      return;
    }

    void loadInitial();
  }, [
    enabled,
    loadInitial,
    reset,
    serializedFilters,
  ]);

  return {
    claims,
    loading,
    loadingMore,
    refreshing,
    error,
    hasMore,
    reload,
    loadMore,
    reset,
  };
}
