"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getServicePartnerAssignment,
} from "@/services/servicePartnerService";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface UseServicePartnerAssignmentOptions {
  readonly enabled?: boolean;
}

interface UseServicePartnerAssignmentResult {
  readonly assignment: ServicePartnerAssignment | null;
  readonly loading: boolean;
  readonly refreshing: boolean;
  readonly notFound: boolean;
  readonly error: Error | null;
  readonly reload: () => Promise<void>;
  readonly replaceAssignment: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly clear: () => void;
}

export function useServicePartnerAssignment(
  assignmentId:
    | string
    | null
    | undefined,
  {
    enabled = true,
  }: UseServicePartnerAssignmentOptions = {}
): UseServicePartnerAssignmentResult {
  const [
    assignment,
    setAssignment,
  ] = useState<ServicePartnerAssignment | null>(
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
          !assignmentId?.trim()
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
            await getServicePartnerAssignment(
              assignmentId
            );

          if (
            sequence !==
            requestSequence.current
          ) {
            return;
          }

          setAssignment(result);
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
                  "Unable to load the service partner assignment."
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
        assignmentId,
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

  const replaceAssignment =
    useCallback(
      (
        updatedAssignment: ServicePartnerAssignment
      ): void => {
        setAssignment(
          updatedAssignment
        );
        setNotFound(false);
      },
      []
    );

  const clear =
    useCallback((): void => {
      requestSequence.current += 1;
      setAssignment(null);
      setLoading(false);
      setRefreshing(false);
      setNotFound(false);
      setError(null);
    }, []);

  useEffect(() => {
    if (
      !enabled ||
      !assignmentId?.trim()
    ) {
      clear();
      return;
    }

    void load();
  }, [
    assignmentId,
    clear,
    enabled,
    load,
  ]);

  return {
    assignment,
    loading,
    refreshing,
    notFound,
    error,
    reload,
    replaceAssignment,
    clear,
  };
}
