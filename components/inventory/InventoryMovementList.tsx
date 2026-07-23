import { InventoryMovementCard } from "@/components/inventory/InventoryMovementCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { InventoryMovement } from "@/types/inventory";

interface InventoryMovementListProps {
  readonly movements: readonly InventoryMovement[];
}

export function InventoryMovementList({
  movements,
}: InventoryMovementListProps): React.JSX.Element {
  if (movements.length === 0) {
    return (
      <EmptyState
        title="No inventory movements"
        description="Stock adjustments, reservations and fulfilment deductions will appear here."
      />
    );
  }

  return (
    <section
      aria-label="Inventory movement history"
      className="grid gap-4"
    >
      {movements.map((movement) => (
        <InventoryMovementCard
          key={movement.id}
          movement={movement}
        />
      ))}
    </section>
  );
}
