import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  readonly items: readonly BreadcrumbItem[];
  readonly className?: string;
}

export function Breadcrumbs({
  className,
  items,
}: BreadcrumbsProps): React.JSX.Element {
  return (
    <nav
     aria-label="Breadcrumb"
     className={cn("text-sm text-muted", className)}
    >
     <ol className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

      return (
       <li
         key={`${item.label}-${index}`}
         className="inline-flex items-center gap-2"
       >
         {item.href && !isLast ? (
           <Link
            href={item.href}
            className="transition-colors hover:text-foreground"
           >
            {item.label}
           </Link>
         ):(
           <span
            aria-current={isLast ? "page" : undefined}
            className={isLast ? "text-foreground" : undefined}
           >
            {item.label}
           </span>
         )}

         {!isLast ? (
           <ChevronRight
             aria-hidden="true"
             className="size-3.5"
           />
         ) : null}
        </li>
      );
    })}
   </ol>

   </nav>
 );
}
