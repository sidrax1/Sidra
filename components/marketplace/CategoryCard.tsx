import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PUBLIC_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  readonly category: Category;
  readonly priority?: boolean;
  readonly className?: string;
}

export function CategoryCard({
  category,
  className,
  priority = false,
}: CategoryCardProps): React.JSX.Element {
  return (
   <Link
     href={PUBLIC_ROUTES.CATEGORY(
       category.slug
     )}
     className={cn(
       "group relative flex min-h-44 overflow-hidden rounded-[var(--radius-lg)]",
       "border border-border bg-card shadow-[var(--shadow-card)]",
       "transition-[transform,border-color,box-shadow] duration-[var(--duration-slow)]",

      "hover:-translate-y-1 hover:border-[color:rgb(200_169_106_/_0.42)]",
      "hover:shadow-[var(--shadow-hover)]",
      className
    )}
   >
    <div className="flex min-w-0 flex-1 flex-col justify-between p-6">
      <div>
       <p className="text-xs font-semibold uppercase tracking-[0.18em]
text-[var(--color-gold-600)]">
         Explore Category
       </p>

       <h3 className="mt-3 font-heading text-3xl font-medium leading-none
tracking-[-0.035em] text-foreground">
        {category.name}
       </h3>

      {category.description ? (
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
          {category.description}
        </p>
      ) : null}
     </div>

      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium
text-foreground">
       Discover
       <ArrowRight
        aria-hidden={true}
        className="size-4 transition-transform duration-[var(--duration-base)]
group-hover:translate-x-1"
       />
      </span>
    </div>

   <div className="relative w-[42%] shrink-0 overflow-hidden bg-[var(--color-gray-100)]">
    {category.image ? (
     <Image
       src={category.image}
       alt={category.name}
       fill
       priority={priority}
       sizes="(max-width: 640px) 40vw, 20vw"

        className="object-cover transition-transform duration-[700ms]
group-hover:scale-[1.06]"
       />
     ):(
       <div className="size-full
bg-[radial-gradient(circle_at_center,rgba(200,169,106,0.45),transparent_60%),linear-gradient(14
5deg,#f7f4ef,#efe3cb)]" />
     )}

      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-card to-transparent"
/>
    </div>
   </Link>
 );
}
