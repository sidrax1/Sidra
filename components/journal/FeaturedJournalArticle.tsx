import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { JournalArticle } from "@/types/journal";

interface FeaturedJournalArticleProps {
  readonly article: JournalArticle;
  readonly className?: string;
}

export function FeaturedJournalArticle({
  article,
  className,
}: FeaturedJournalArticleProps): React.JSX.Element {
  return (
   <article
     className={cn(
       "relative isolate overflow-hidden rounded-[var(--radius-xl)] border",
       "border-[color:rgb(200_169_106_/_0.3)] bg-[var(--color-black-900)]",
       "shadow-[var(--shadow-modal)]",
       className
     )}
   >
     <div className="grid min-h-[560px] lg:grid-cols-[1.05fr_0.95fr]">
       <div className="relative min-h-80 overflow-hidden">

      <Image
       src={article.coverImageURL}
       alt={article.title}
       fill
       priority
       sizes="(max-width: 1024px) 100vw, 55vw"
       className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/25
lg:bg-gradient-to-l" />
     </div>

    <div className="relative flex flex-col justify-center p-8 text-white md:p-12 lg:p-16">
     <div
      aria-hidden={true}
      className="absolute inset-0 opacity-50"
      style={{
        background:
         "radial-gradient(circle at 75% 20%, rgba(200,169,106,0.26), transparent 40%)",
      }}
     />

      <div className="relative z-10">
       <Badge variant="gold">
        <Sparkles
          aria-hidden={true}
          className="mr-1 size-3.5"
        />
        Featured Story
       </Badge>

       <h1 className="mt-6 font-heading text-[clamp(3rem,6vw,5.7rem)] font-medium
leading-[0.93] tracking-[-0.055em]">
         {article.title}
       </h1>

       <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
        {article.excerpt}
       </p>

        <div className="mt-6 flex flex-wrap items-center gap-5 text-xs uppercase
tracking-[0.14em] text-white/55">
         <span>

         {article.publishedAt
          ? formatDate(
              article.publishedAt
            )
          : "Coming Soon"}
        </span>

        <span className="inline-flex items-center gap-2">
         <Clock3
           aria-hidden={true}
           className="size-3.5"
         />
         {article.readingTimeMinutes} min
        </span>
       </div>

         <Button
          asChild
          size="lg"
          className="mt-8"
         >
          <Link
            href={PUBLIC_ROUTES.JOURNAL_ARTICLE(
              article.slug
            )}
          >
            Read the Story
            <ArrowRight aria-hidden={true} />
          </Link>
         </Button>
       </div>
     </div>
    </div>
   </article>
 );
}
