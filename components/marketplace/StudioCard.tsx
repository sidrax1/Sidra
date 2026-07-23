import Image from "next/image";
import Link from "next/link";

import {
  BadgeCheck,
  Package,
  Users,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Studio } from "@/types/studio";

interface StudioCardProps {
  readonly studio: Studio;
  readonly priority?: boolean;
  readonly className?: string;
}

export function StudioCard({
  className,
  priority = false,
  studio,
}: StudioCardProps): React.JSX.Element {
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
       href={PUBLIC_ROUTES.STUDIO(
         studio.slug
       )}
       className="block"
     >
       <div className="relative aspect-[16/7] overflow-hidden bg-[var(--color-charcoal-800)]">
         {studio.coverImage ? (
          <Image

         src={studio.coverImage}
         alt={`${studio.name} studio cover`}
         fill
         priority={priority}
         sizes="(max-width: 768px) 100vw, 50vw"
         className="object-cover transition-transform duration-[700ms]
ease-[var(--ease-luxury)] group-hover:scale-[1.04]"
        />
      ):(
        <div className="size-full
bg-[radial-gradient(circle_at_top_left,rgba(200,169,106,0.35),transparent_42%),linear-gradient(1
35deg,#111111,#1c1b19)]" />
      )}

       <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10
to-transparent" />

      <div className="absolute left-5 top-5">
       {studio.verified ? (
         <Badge
           variant="gold"
           className="backdrop-blur-xl"
         >
           <BadgeCheck
            aria-hidden="true"
            className="mr-1 size-3.5"
           />
           Verified Studio
         </Badge>
       ) : null}
      </div>
     </div>

     <div className="relative px-5 pb-6">
      <div className="-mt-8 flex items-end justify-between gap-4">
       <Avatar
         name={studio.name}
         src={studio.logo}
         size="xl"
         priority={priority}
         className="border-4 border-card"
       />

       <Rating

        value={studio.rating}
        count={studio.reviewCount}
        className="pb-1"
       />
      </div>

       <div className="mt-5">
        <h3 className="inline-flex items-center gap-2 font-heading text-3xl font-medium
tracking-[-0.03em] text-foreground transition-colors group-hover:text-[var(--color-gold-600)]">
         {studio.name}

        {studio.verified ? (
          <BadgeCheck
            aria-label="Verified studio"
            className="size-5 text-[var(--color-gold-500)]"
          />
        ) : null}
       </h3>

       <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
        {studio.description}
       </p>
      </div>

       <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-border pt-4
text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <Package
            aria-hidden="true"
            className="size-4 text-[var(--color-gold-600)]"
          />
          {studio.productCount.toLocaleString(
            "en-IN"
          )}{" "}
          pieces
        </span>

       <span className="inline-flex items-center gap-2">
        <Users
         aria-hidden="true"
         className="size-4 text-[var(--color-gold-600)]"
        />
        {studio.followers.toLocaleString(
         "en-IN"

          )}{" "}
          followers
         </span>
       </div>
     </div>
    </Link>
   </article>
 );
}
