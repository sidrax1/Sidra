import type { ReactNode } from "react";

import { AdminStudioCard } from "@/components/admin/AdminStudioCard";
import type { AdminStudioStatus } from "@/components/admin/StudioStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Studio } from "@/types/studio";

export interface AdminStudioListItem {
  readonly studio: Studio;
  readonly status: AdminStudioStatus;
}

interface AdminStudioListProps {
  readonly items: readonly AdminStudioListItem[];
  readonly loadingStudioIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onView: (studio: Studio) => void;
  readonly onVerify: (studio: Studio) => void | Promise<void>;
  readonly onSuspend: (studio: Studio) => void | Promise<void>;
}

export function AdminStudioList({

  emptyAction,
  items,
  loadingStudioIds,
  onSuspend,
  onVerify,
  onView,
}: AdminStudioListProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No studios found"
        description="No studios match the selected moderation filters."
        action={emptyAction}
      />
    );
  }

 return (
   <div className="grid gap-4">
    {items.map(({ status, studio }) => (
      <AdminStudioCard
        key={studio.id}
        studio={studio}
        status={status}
        loading={loadingStudioIds?.has(studio.id) ?? false}
        onView={onView}
        onVerify={onVerify}
        onSuspend={onSuspend}
      />
    ))}
   </div>
 );
}
