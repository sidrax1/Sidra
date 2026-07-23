"use client";

import {
  ArrowRight,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";
import {
  Card,
} from "@/components/ui/Card";
import {
  formatDate,
} from "@/lib/date";
import type {
  WarrantyClaim,
} from "@/types/warranty";
import {
  WarrantyClaimStatusBadge,
} from "./WarrantyClaimStatusBadge";

interface WarrantyClaimCardProps {
  readonly claim: WarrantyClaim;
  readonly onOpen: (
    claim: WarrantyClaim
  ) => void;
}

export function WarrantyClaimCard({
  claim,
  onOpen,
}: WarrantyClaimCardProps): React.JSX.Element {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <WarrantyClaimStatusBadge
            status={claim.status}
          />

          <h2 className="mt-4 font-heading text-2xl">
            {claim.issueTitle}
          </h2>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
            {claim.issueDescription}
          </p>

          <p className="mt-4 text-xs text-muted">
            Submitted{" "}
            {formatDate(
              claim.createdAt
            )}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            onOpen(claim)
          }
        >
          Open
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
