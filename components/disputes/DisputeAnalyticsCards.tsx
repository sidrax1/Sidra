"use client";

import {
  AlertTriangle,
  BadgeIndianRupee,
  CheckCircle2,
  Clock3,
  ShieldAlert,
} from "lucide-react";

import {
  MetricCard,
} from "@/components/ui/MetricCard";
import type {
  DisputeAnalytics,
} from "@/types/dispute";

interface Props {
  readonly analytics: DisputeAnalytics;
}

export function DisputeAnalyticsCards({
  analytics,
}: Props): React.JSX.Element {
  return (
    <section className="grid gap-5 xl:grid-cols-5">
      <MetricCard
        label="Open Disputes"
        value={analytics.openDisputes}
        icon={<Clock3 />}
      />

      <MetricCard
        label="Urgent"
        value={analytics.urgentDisputes}
        icon={<AlertTriangle />}
      />

      <MetricCard
        label="Resolved"
        value={
          analytics.resolvedForCustomer +
          analytics.resolvedForStudio
        }
        icon={<CheckCircle2 />}
      />

      <MetricCard
        label="Disputed Value"
        value={`₹${(
          analytics.disputedValuePaise / 100
        ).toLocaleString("en-IN")}`}
        icon={<BadgeIndianRupee />}
      />

      <MetricCard
        label="Recovered"
        value={`₹${(
          analytics.recoveredValuePaise / 100
        ).toLocaleString("en-IN")}`}
        icon={<ShieldAlert />}
      />
    </section>
  );
}
