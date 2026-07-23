import Image from "next/image";

import {
  Clock3,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { formatDate } from "@/lib/date";
import type { JournalArticle } from "@/types/journal";

interface JournalArticleHeaderProps {
  readonly article: JournalArticle;
  readonly authorName: string;
}

export function JournalArticleHeader({
  article,
  authorName,
}: JournalArticleHeaderProps): React.JSX.Element {
  return (
   <header className="pb-12 pt-28 md:pb-16 md:pt-36">
     <Container>
       <div className="mx-auto max-w-5xl text-center">
        <div className="flex flex-wrap justify-center gap-2">
         {article.categoryIds.map(
           (categoryId) => (
             <Badge
              key={categoryId}
              variant="gold"
             >
              {categoryId}
             </Badge>
           )
         )}
        </div>

      <h1 className="mt-7 font-heading text-[clamp(3.2rem,8vw,7.5rem)] font-medium
leading-[0.9] tracking-[-0.06em] text-foreground">
       {article.title}
      </h1>

      <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted">
       {article.excerpt}
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted">
       <span className="inline-flex items-center gap-2">
        <UserRound
          aria-hidden={true}
          className="size-4 text-[var(--color-gold-600)]"
        />
        {authorName}
       </span>

       <span>
        {article.publishedAt
         ? formatDate(
             article.publishedAt
           )
         : "Editorial Draft"}
       </span>

       <span className="inline-flex items-center gap-2">
         <Clock3
          aria-hidden={true}
          className="size-4 text-[var(--color-gold-600)]"
         />
         {article.readingTimeMinutes} minute read
       </span>
      </div>
     </div>

      <div className="relative mt-12 aspect-[16/8] overflow-hidden rounded-[var(--radius-xl)]
border border-border bg-[var(--color-gray-100)] shadow-[var(--shadow-hover)]">
       <Image
        src={article.coverImageURL}
        alt={article.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
       />
      </div>
     </Container>
    </header>
  );
}
