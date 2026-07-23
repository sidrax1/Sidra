"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getWarranty,
} from "@/services/warrantyService";
import type {
  ProductWarranty,
} from "@/types/warranty";

export function useWarranty(
  warrantyId?: string
) {
  const [
    warranty,
    setWarranty,
  ] = useState<ProductWarranty | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const load =
    useCallback(async () => {
      if (!warrantyId) {
        return;
      }

      setLoading(true);

      try {
        const result =
          await getWarranty(
            warrantyId
          );

        setWarranty(result);
      } finally {
        setLoading(false);
      }
    }, [warrantyId]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    warranty,
    loading,
    reload: load,
  };
}
