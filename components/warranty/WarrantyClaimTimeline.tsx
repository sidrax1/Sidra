"use client";

import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import {
  formatDateTime,
} from "@/lib/date";
import type {
  WarrantyTimelineEvent,
} from "@/types/warranty";

interface WarrantyClaimTimelineProps {
  readonly events: readonly WarrantyTimelineEvent[];
}

export function WarrantyClaimTimeline({
  events,
}: WarrantyClaimTimelineProps): React.JSX.Element {
  return (
    <section className="rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <h2 className="font-heading text-2xl font-medium">
        Claim Timeline
      </h2>

      <div className="mt-6 space-y-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
                {event.actorRole ===
                "system" ? (
                  <Clock3 className="size-5" />
                ) : event.actorRole ===
                  "support" ? (
                  <ShieldCheck className="size-5" />
                ) : (
                  <CheckCircle2 className="size-5" />
                )}
              </span>

              <span className="mt-2 h-full w-px bg-border" />
            </div>

            <div className="pb-6">
              <h3 className="font-medium">
                {event.title}
              </h3>

              {event.description ? (
                <p className="mt-2 text-sm leading-6 text-muted">
                  {event.description}
                </p>
              ) : null}

              <time className="mt-2 block text-xs text-muted">
                {formatDateTime(
                  event.createdAt
                )}
              </time>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
