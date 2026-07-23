import type {
  ReactNode,
} from "react";

import {
  FollowedStudioCard,
  type FollowedStudio,
} from "@/components/followers/FollowedStudioCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface FollowedStudioGridProps {
  readonly studios: readonly FollowedStudio[];
  readonly loadingStudioIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onUnfollow?: (
    studio: FollowedStudio
  ) => void | Promise<void>;
}

export function FollowedStudioGrid({
  emptyAction,
  loadingStudioIds,
  onUnfollow,
  studios,
}: FollowedStudioGridProps): React.JSX.Element {
  if (studios.length === 0) {
    return (
      <EmptyState
        title="No followed Studios"
        description="Studios you choose to follow will appear here for private, convenient access."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Followed studios"
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      {studios.map((studio) => (
        <FollowedStudioCard
          key={studio.id}
          studio={studio}
          loading={
            loadingStudioIds?.has(
              studio.id
            ) ?? false
          }
          onUnfollow={onUnfollow}
        />
      ))}
    </section>
  );
}
