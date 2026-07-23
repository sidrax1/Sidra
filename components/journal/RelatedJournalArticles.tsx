import { JournalGrid } from "@/components/journal/JournalGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { JournalArticle } from "@/types/journal";

interface RelatedJournalArticlesProps {
  readonly articles: readonly JournalArticle[];
}

export function RelatedJournalArticles({
  articles,
}: RelatedJournalArticlesProps): React.JSX.Element | null {
  if (articles.length === 0) {
    return null;
  }

 return (
  <section className="grid gap-8">
    <SectionHeading
     eyebrow="Continue Reading"
     title="Related Stories"
     description="Further perspectives on material, process and independent craft."
    />

    <JournalGrid
     articles={articles}
     priorityCount={0}
    />
   </section>
 );
}
