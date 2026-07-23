"use client";

import {
  AlertTriangle,
  CalendarClock,
  ReceiptText,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

import {
  DisputePriorityBadge,
} from "@/components/disputes/DisputePriorityBadge";
import {
  DisputeReasonBadge,
} from "@/components/disputes/DisputeReasonBadge";
import {
  DisputeStatusBadge,
} from "@/components/disputes/DisputeStatusBadge";
import {
  Price,
} from "@/components/ui/Price";
import {
  Surface,
} from "@/components/ui/Surface";
import {
  formatDateTime,
} from "@/lib/date";
import type {
  Dispute,
} from "@/types/dispute";

interface DisputeHeaderProps {
  readonly dispute: Dispute;
}

export function DisputeHeader({
  dispute,
}: DisputeHeaderProps): React.JSX.Element {
  return (
    <Surface
      padding="none"
      shadow="hover"
      className="overflow-hidden"
    >
      <header className="relative overflow-hidden bg-[var(--color-black-950)] px-8 py-10 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,169,106,0.22),transparent_42%)]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap gap-3">
              <DisputeStatusBadge
                status={dispute.status}
              />

              <DisputePriorityBadge
                priority={dispute.priority}
              />

              <DisputeReasonBadge
                reason={dispute.reason}
              />
            </div>

            <p className="mt-7 text-xs uppercase tracking-[0.22em] text-[var(--color-gold-500)]">
              Protected Dispute
            </p>

            <h1 className="mt-3 font-heading text-5xl font-medium tracking-[-0.05em]">
              #{dispute.disputeNumber}
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/70">
              {dispute.description}
            </p>
          </div>

          <div className="grid gap-4 rounded-[var(--radius-xl)] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-white/55">
                Disputed Amount
              </p>

              <Price
                amount={
                  dispute.financialImpact
                    .disputedAmountPaise / 100
                }
                size="xl"
              />
            </div>

            <div className="grid gap-2 text-sm text-white/65">
              <span className="inline-flex items-center gap-2">
                <ReceiptText className="size-4" />
                {dispute.order.orderNumber}
              </span>

              <span className="inline-flex items-center gap-2">
                <Store className="size-4" />
                {dispute.order.studioName}
              </span>

              <span className="inline-flex items-center gap-2">
                <UserRound className="size-4" />
                {dispute.order.customerEmail}
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarClock className="size-4" />
                {formatDateTime(
                  dispute.responseDueAt
                )}
              </span>

              <span className="inline-flex items-center gap-2">
                <AlertTriangle className="size-4 text-[var(--color-warning)]" />
                Risk Score {dispute.riskScore}
              </span>

              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-[var(--color-success)]" />
                Protected Moderation
              </span>
            </div>
          </div>
        </div>
      </header>
    </Surface>
  );
}
