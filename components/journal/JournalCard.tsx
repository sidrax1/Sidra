import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { JournalArticle } from "@/types/journal";

interface JournalCardProps {
  readonly article: JournalArticle;
  readonly priority?: boolean;
  readonly className?: string;
}

export function JournalCard({
  article,
  className,
  priority = false,
}: JournalCardProps): React.JSX.Element {
  return (
   <article

   className={cn(
     "group overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card",
     "shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow]",
     "duration-[var(--duration-slow)] ease-[var(--ease-luxury)]",
     "hover:-translate-y-1 hover:border-[color:rgb(200_169_106_/_0.42)]",
     "hover:shadow-[var(--shadow-hover)]",
     className
   )}
  >
   <Link
     href={PUBLIC_ROUTES.JOURNAL_ARTICLE(
       article.slug
     )}
     className="block"
   >
     <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-gray-100)]">
       <Image
        src={article.coverImageURL}
        alt={article.title}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-[800ms] ease-[var(--ease-luxury)]
group-hover:scale-[1.045]"
       />

       <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent
to-transparent opacity-60" />

      <span className="absolute right-4 top-4 flex size-11 items-center justify-center
rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-xl transition-transform
duration-[var(--duration-base)] group-hover:-translate-y-1 group-hover:translate-x-1">
       <ArrowUpRight
         aria-hidden="true"
         className="size-4"
       />
      </span>
     </div>

     <div className="p-6">
      <div className="flex flex-wrap items-center gap-3">
       {article.categoryIds
         .slice(0, 2)
         .map((categoryId) => (

          <Badge
            key={categoryId}
            variant="gold"
          >
            {categoryId}
          </Badge>
        ))}

       <span className="inline-flex items-center gap-1.5 text-xs text-muted">
        <Clock3
          aria-hidden="true"
          className="size-3.5"
        />
        {article.readingTimeMinutes} min read
       </span>
      </div>

       <h2 className="mt-5 font-heading text-3xl font-medium leading-tight tracking-[-0.035em]
text-foreground transition-colors group-hover:text-[var(--color-gold-600)]">
        {article.title}
       </h2>

      <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">
       {article.excerpt}
      </p>

        <footer className="mt-6 border-t border-border pt-4 text-xs uppercase tracking-[0.14em]
text-muted">
          {article.publishedAt
           ? formatDate(
               article.publishedAt
             )
           : "Editorial Draft"}
        </footer>
      </div>
     </Link>
    </article>
  );
}
