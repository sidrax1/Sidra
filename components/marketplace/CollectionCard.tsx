import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { PUBLIC_ROUTES } from "@/constants/routes";

import { cn } from "@/lib/utils";
import type { Collection } from "@/types/collection";

interface CollectionCardProps {
  readonly collection: Collection;
  readonly priority?: boolean;
  readonly className?: string;
}

export function CollectionCard({
  className,
  collection,
  priority = false,
}: CollectionCardProps): React.JSX.Element {
  return (
   <article
     className={cn(
       "group relative isolate aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)]",
       "border border-[color:rgb(200_169_106_/_0.24)]",
       "bg-[var(--color-black-900)] shadow-[var(--shadow-hover)]",
       className
     )}
   >
     <Link
       href={PUBLIC_ROUTES.COLLECTION(
         collection.slug
       )}
       aria-label={`Explore ${collection.title}`}
       className="absolute inset-0 z-20"
     />

   <Image
    src={collection.coverImage}
    alt={collection.title}
    fill
    priority={priority}
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-luxury)]
group-hover:scale-[1.055]"
   />

    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/10" />

    <div

    aria-hidden={true}
    className="absolute inset-0 opacity-0 transition-opacity duration-[var(--duration-slow)]
group-hover:opacity-100"
    style={{
      background:
       "radial-gradient(circle at 70% 20%, rgba(200,169,106,0.2), transparent 38%)",
    }}
   />

   <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white md:p-8">
    {collection.featured ? (
      <Badge
        variant="gold"
        className="mb-4"
      >
        Sidra Selection
      </Badge>
    ) : null}

     <div className="flex items-end justify-between gap-5">
      <div>
       <h3 className="font-heading text-4xl font-medium leading-none tracking-[-0.04em]">
         {collection.title}
       </h3>

       {collection.description ? (
         <p className="mt-3 line-clamp-2 max-w-md text-sm leading-6 text-white/70">
           {collection.description}
         </p>
       ) : null}

       <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--color-gold-500)]">
        {collection.productIds.length.toLocaleString(
          "en-IN"
        )}{" "}
        curated pieces
       </p>
      </div>

      <span className="flex size-12 shrink-0 items-center justify-center rounded-full border
border-white/20 bg-white/10 backdrop-blur-xl transition-[transform,background-color]
duration-[var(--duration-base)] group-hover:-translate-y-1 group-hover:translate-x-1
group-hover:bg-white/20">
       <ArrowUpRight

          aria-hidden={true}
          className="size-5"
         />
       </span>
     </div>
    </div>
   </article>
 );
}
