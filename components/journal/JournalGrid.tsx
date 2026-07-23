import type { ReactNode } from "react";

import { ContentGrid } from "@/components/layout/ContentGrid";
import { JournalCard } from "@/components/journal/JournalCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { JournalArticle } from "@/types/journal";

interface JournalGridProps {
  readonly articles: readonly JournalArticle[];
  readonly priorityCount?: number;
  readonly emptyAction?: ReactNode;
}

export function JournalGrid({
  articles,
  emptyAction,
  priorityCount = 2,
}: JournalGridProps): React.JSX.Element {
  if (articles.length === 0) {
    return (
      <EmptyState
       title="No journal stories"
       description="Editorial stories, studio profiles and craft guidance will appear here."
       action={emptyAction}
      />
    );
  }

 return (
  <ContentGrid columns={3}>
    {articles.map(
      (article, index) => (
        <JournalCard
         key={article.id}
         article={article}
         priority={
           index < priorityCount
         }
        />
      )
    )}
  </ContentGrid>

 );
}
