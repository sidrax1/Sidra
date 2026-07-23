"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import {
  getServicePartners,
  type ServicePartnerFilters,
} from "@/services/servicePartnerService";
import type {
  ServicePartner,
} from "@/types/service-partner";

interface UseServicePartnersOptions
  extends Omit<
    ServicePartnerFilters,
    "cursor"
  > {
  readonly enabled?: boolean;
}

interface UseServicePartnersResult {
  readonly partners: readonly ServicePartner[];
  readonly loading: boolean;
  readonly refreshing: boolean;
  readonly loadingMore: boolean;
  readonly error: Error | null;
  readonly hasMore: boolean;
  readonly reload: () => Promise<void>;
  readonly loadMore: () => Promise<void>;
  readonly reset: () => void;
  readonly replacePartner: (
    partner: ServicePartner
  ) => void;
}

export function useServicePartners({
  enabled = true,
  pageSize = 20,
  ...filters
}: UseServicePartnersOptions = {}): UseServicePartnersResult {
  const [partners, setPartners] =
    useState<
      readonly ServicePartner[]
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
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    loadingMore,
    setLoadingMore,
  ] = useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  const requestSequence =
    useRef(0);

  const serializedFilters =
    useMemo(
      () =>
        JSON.stringify({
          statuses:
            filters.statuses
              ? [...filters.statuses]
              : null,
          partnerTypes:
            filters.partnerTypes
              ? [
                  ...filters.partnerTypes,
                ]
              : null,
          capabilities:
            filters.capabilities
              ? [
                  ...filters.capabilities,
                ]
              : null,
          state:
            filters.state ?? null,
          city:
            filters.city ?? null,
          acceptingAssignments:
            filters.acceptingAssignments ??
            null,
          minimumQualityScore:
            filters.minimumQualityScore ??
            null,
          minimumRating:
            filters.minimumRating ??
            null,
          pageSize,
        }),
      [
        filters.acceptingAssignments,
        filters.capabilities,
        filters.city,
        filters.minimumQualityScore,
        filters.minimumRating,
        filters.partnerTypes,
        filters.state,
        filters.statuses,
        pageSize,
      ]
    );

  const normalizedFilters =
    useMemo<
      Omit<
        ServicePartnerFilters,
        "cursor"
      >
    >(
      () => ({
        statuses:
          filters.statuses,
        partnerTypes:
          filters.partnerTypes,
        capabilities:
          filters.capabilities,
        state: filters.state,
        city: filters.city,
        acceptingAssignments:
          filters.acceptingAssignments,
        minimumQualityScore:
          filters.minimumQualityScore,
        minimumRating:
          filters.minimumRating,
        pageSize,
      }),
      [serializedFilters]
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
            await getServicePartners(
              normalizedFilters
            );

          if (
            sequence !==
            requestSequence.current
          ) {
            return;
          }

          setPartners(
            result.partners
          );
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
                  "Unable to load service partners."
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
          !cursor ||
          !hasMore ||
          loading ||
          loadingMore
        ) {
          return;
        }

        setLoadingMore(true);
        setError(null);

        try {
          const result =
            await getServicePartners({
              ...normalizedFilters,
              cursor,
            });

          setPartners(
            (currentPartners) => {
              const partnersById =
                new Map(
                  currentPartners.map(
                    (partner) => [
                      partner.id,
                      partner,
                    ]
                  )
                );

              for (const partner of
                result.partners) {
                partnersById.set(
                  partner.id,
                  partner
                );
              }

              return [
                ...partnersById.values(),
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
                  "Unable to load more service partners."
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
      setPartners([]);
      setCursor(null);
      setHasMore(false);
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      setError(null);
    }, []);

  const replacePartner =
    useCallback(
      (
        updatedPartner: ServicePartner
      ): void => {
        setPartners(
          (currentPartners) => {
            const partnerExists =
              currentPartners.some(
                (partner) =>
                  partner.id ===
                  updatedPartner.id
              );

            if (!partnerExists) {
              return [
                updatedPartner,
                ...currentPartners,
              ];
            }

            return currentPartners.map(
              (partner) =>
                partner.id ===
                updatedPartner.id
                  ? updatedPartner
                  : partner
            );
          }
        );
      },
      []
    );

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
    partners,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    reload,
    loadMore,
    reset,
    replacePartner,
  };
}
