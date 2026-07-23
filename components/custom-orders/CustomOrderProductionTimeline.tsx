import {
  CustomOrderProductionUpdateCard,
} from "@/components/custom-orders/CustomOrderProductionUpdateCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CustomOrderProductionUpdate } from "@/types/custom-order-workflow";

interface CustomOrderProductionTimelineProps {
  readonly updates: readonly CustomOrderProductionUpdate[];
}

export function CustomOrderProductionTimeline({
  updates,
}: CustomOrderProductionTimelineProps): React.JSX.Element {
  if (updates.length === 0) {
    return (
      <EmptyState
        title="Production has not started"
        description="Craft milestones, quality checks and approved progress media will appear here."
      />
    );
  }

  const orderedUpdates = [
    ...updates,
  ].sort((first, second) =>
    second.createdAt.localeCompare(
      first.createdAt
    )
  );

  return (
    <section
      aria-label="Custom-order production timeline"
      className="relative grid gap-5"
    >
      <div
        aria-hidden={true}
        className="absolute bottom-8 left-[1.35rem] top-8 hidden w-px bg-border sm:block"
      />

      {orderedUpdates.map((update) => (
        <div
          key={update.id}
          className="relative sm:pl-14"
        >
          <span
            aria-hidden={true}
            className="absolute left-[1.03rem] top-8 hidden size-3 rounded-full border-2 border-background bg-[var(--color-gold-500)] shadow-[var(--shadow-gold-glow)] sm:block"
          />

          <CustomOrderProductionUpdateCard
            update={update}
          />
        </div>
      ))}
    </section>
  );
}
