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
  getServicePartnerApplications,
  type ServicePartnerApplicationFilters,
} from "@/services/servicePartnerService";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface UseServicePartnerApplicationsOptions
  extends Omit<
    ServicePartnerApplicationFilters,
    "cursor"
  > {
  readonly enabled?: boolean;
}

interface UseServicePartnerApplicationsResult {
  readonly applications: readonly ServicePartnerApplication[];
  readonly loading: boolean;
  readonly refreshing: boolean;
  readonly loadingMore: boolean;
  readonly hasMore: boolean;
  readonly error: Error | null;
  readonly reload: () => Promise<void>;
  readonly loadMore: () => Promise<void>;
  readonly replaceApplication: (
    application: ServicePartnerApplication
  ) => void;
  readonly reset: () => void;
}

export function useServicePartnerApplications({
  enabled = true,
  pageSize = 20,
  ...filters
}: UseServicePartnerApplicationsOptions = {}): UseServicePartnerApplicationsResult {
  const [
    applications,
    setApplications,
  ] = useState<
    readonly ServicePartnerApplication[]
  >([]);

  const [cursor, setCursor] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(
      null
    );

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

  const [hasMore, setHasMore] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  const requestSequence =
    useRef(0);

  const serializedFilters =
    useMemo(
      () =>
        JSON.stringify({
          applicantUserId:
            filters.applicantUserId ??
            null,
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
          reviewerId:
            filters.reviewerId ??
            null,
          pageSize,
        }),
      [
        filters.applicantUserId,
        filters.partnerTypes,
        filters.reviewerId,
        filters.statuses,
        pageSize,
      ]
    );

  const normalizedFilters =
    useMemo<
      Omit<
        ServicePartnerApplicationFilters,
        "cursor"
      >
    >(
      () => ({
        applicantUserId:
          filters.applicantUserId,
        statuses:
          filters.statuses,
        partnerTypes:
          filters.partnerTypes,
        reviewerId:
          filters.reviewerId,
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
            await getServicePartnerApplications(
              normalizedFilters
            );

          if (
            sequence !==
            requestSequence.current
          ) {
            return;
          }

          setApplications(
            result.applications
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
                  "Unable to load service partner applications."
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
            await getServicePartnerApplications({
              ...normalizedFilters,
              cursor,
            });

          setApplications(
            (currentApplications) => {
              const applicationsById =
                new Map(
                  currentApplications.map(
                    (application) => [
                      application.id,
                      application,
                    ]
                  )
                );

              for (const application of
                result.applications) {
                applicationsById.set(
                  application.id,
                  application
                );
              }

              return [
                ...applicationsById.values(),
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
                  "Unable to load more service partner applications."
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

  const replaceApplication =
    useCallback(
      (
        updatedApplication: ServicePartnerApplication
      ): void => {
        setApplications(
          (
            currentApplications
          ) => {
            const exists =
              currentApplications.some(
                (application) =>
                  application.id ===
                  updatedApplication.id
              );

            if (!exists) {
              return [
                updatedApplication,
                ...currentApplications,
              ];
            }

            return currentApplications.map(
              (application) =>
                application.id ===
                updatedApplication.id
                  ? updatedApplication
                  : application
            );
          }
        );
      },
      []
    );

  const reset =
    useCallback((): void => {
      requestSequence.current += 1;
      setApplications([]);
      setCursor(null);
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      setHasMore(false);
      setError(null);
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
    applications,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    reload,
    loadMore,
    replaceApplication,
    reset,
  };
}
