import type { ReactNode } from "react";

import { ContentGrid } from "@/components/layout/ContentGrid";
import { StudioCard } from "@/components/marketplace/StudioCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { Studio } from "@/types/studio";

interface StudioGridProps {
  readonly studios: readonly Studio[];
  readonly priorityStudioCount?: number;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly emptyAction?: ReactNode;
  readonly className?: string;
}

export function StudioGrid({
  className,
  emptyAction,
  emptyDescription = "No verified studios are available in this curation at the moment.",
  emptyTitle = "No studios found",
  priorityStudioCount = 2,
  studios,
}: StudioGridProps): React.JSX.Element {
  if (studios.length === 0) {
    return (
      <EmptyState

         title={emptyTitle}
         description={emptyDescription}
         action={emptyAction}
         className={className}
        />
      );
 }

 return (
   <ContentGrid
    columns={2}
    className={cn(
      "items-start",
      className
    )}
   >
    {studios.map(
      (studio, index) => (
        <StudioCard
         key={studio.id}
         studio={studio}
         priority={
           index <
           priorityStudioCount
         }
        />
      )
    )}
   </ContentGrid>
 );
}
