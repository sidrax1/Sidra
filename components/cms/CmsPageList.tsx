import type { ReactNode } from "react";

import { CmsPageCard } from "@/components/cms/CmsPageCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CmsPage } from "@/types/cms";

interface CmsPageListProps {
  readonly pages: readonly CmsPage[];
  readonly loadingPageIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;

    readonly onPreview: (page: CmsPage) => void;
    readonly onEdit: (page: CmsPage) => void;
    readonly onDuplicate: (page: CmsPage) => void | Promise<void>;
    readonly onArchive: (page: CmsPage) => void | Promise<void>;
}

export function CmsPageList({
  emptyAction,
  loadingPageIds,
  onArchive,
  onDuplicate,
  onEdit,
  onPreview,
  pages,
}: CmsPageListProps): React.JSX.Element {
  if (pages.length === 0) {
    return (
      <EmptyState
       title="No content pages"
       description="Create your first editorial page or refine the current filters."
       action={emptyAction}
      />
    );
  }

    return (
      <div className="grid gap-4">
       {pages.map((page) => (
         <CmsPageCard
           key={page.id}
           page={page}
           loading={loadingPageIds?.has(page.id) ?? false}
           onPreview={onPreview}
           onEdit={onEdit}
           onDuplicate={onDuplicate}
           onArchive={onArchive}
         />
       ))}
      </div>
    );
}
