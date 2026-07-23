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
  getServicePartnerAssignments,
  type ServicePartnerAssignmentFilters,
} from "@/services/servicePartnerService";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface UseServicePartnerAssignmentsOptions
  extends Omit<
    ServicePartnerAssignmentFilters,
    "cursor"
  > {
  readonly enabled?: boolean;
}

interface UseServicePartnerAssignmentsResult {
  readonly assignments: readonly ServicePartnerAssignment[];
  readonly loading: boolean;
  readonly refreshing: boolean;
  readonly loadingMore: boolean;
  readonly hasMore: boolean;
  readonly error: Error | null;
  readonly reload: () => Promise<void>;
  readonly loadMore: () => Promise<void>;
  readonly replaceAssignment: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly reset: () => void;
}

export function useServicePartnerAssignments({
  enabled = true,
  pageSize = 20,
  ...filters
}: UseServicePartnerAssignmentsOptions = {}): UseServicePartnerAssignmentsResult {
  const [
    assignments,
    setAssignments,
  ] = useState<
    readonly ServicePartnerAssignment[]
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
          partnerId:
            filters.partnerId ??
            null,
          customerId:
            filters.customerId ??
            null,
          studioId:
            filters.studioId ??
            null,
          sourceType:
            filters.sourceType ??
            null,
          sourceId:
            filters.sourceId ??
            null,
          statuses:
            filters.statuses
              ? [...filters.statuses]
              : null,
          priorities:
            filters.priorities
              ? [
                  ...filters.priorities,
                ]
              : null,
          pageSize,
        }),
      [
        filters.customerId,
        filters.partnerId,
        filters.priorities,
        filters.sourceId,
        filters.sourceType,
        filters.statuses,
        filters.studioId,
        pageSize,
      ]
    );

  const normalizedFilters =
    useMemo<
      Omit<
        ServicePartnerAssignmentFilters,
        "cursor"
      >
    >(
      () => ({
        partnerId:
          filters.partnerId,
        customerId:
          filters.customerId,
        studioId:
          filters.studioId,
        sourceType:
          filters.sourceType,
        sourceId:
          filters.sourceId,
        statuses:
          filters.statuses,
        priorities:
          filters.priorities,
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
            await getServicePartnerAssignments(
              normalizedFilters
            );

          if (
            sequence !==
            requestSequence.current
          ) {
            return;
          }

          setAssignments(
            result.assignments
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
                  "Unable to load service assignments."
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
            await getServicePartnerAssignments({
              ...normalizedFilters,
              cursor,
            });

          setAssignments(
            (
              currentAssignments
            ) => {
              const assignmentsById =
                new Map(
                  currentAssignments.map(
                    (assignment) => [
                      assignment.id,
                      assignment,
                    ]
                  )
                );

              for (const assignment of
                result.assignments) {
                assignmentsById.set(
                  assignment.id,
                  assignment
                );
              }

              return [
                ...assignmentsById.values(),
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
                  "Unable to load more service assignments."
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

  const replaceAssignment =
    useCallback(
      (
        updatedAssignment: ServicePartnerAssignment
      ): void => {
        setAssignments(
          (
            currentAssignments
          ) => {
            const exists =
              currentAssignments.some(
                (assignment) =>
                  assignment.id ===
                  updatedAssignment.id
              );

            if (!exists) {
              return [
                updatedAssignment,
                ...currentAssignments,
              ];
            }

            return currentAssignments.map(
              (assignment) =>
                assignment.id ===
                updatedAssignment.id
                  ? updatedAssignment
                  : assignment
            );
          }
        );
      },
      []
    );

  const reset =
    useCallback((): void => {
      requestSequence.current += 1;
      setAssignments([]);
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
    assignments,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    reload,
    loadMore,
    replaceAssignment,
    reset,
  };
}
