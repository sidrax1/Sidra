import type { ReactNode } from "react";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  readonly title: string;
  readonly description?: ReactNode;
  readonly breadcrumbs?: readonly BreadcrumbItem[];
  readonly action?: ReactNode;
  readonly className?: string;
}

export function PageHeader({
 action,
 breadcrumbs,
 className,
 description,
 title,

}: PageHeaderProps): React.JSX.Element {
  return (
   <header
     className={cn(
       "border-b border-border bg-card px-5 py-8 md:px-8",
       className
     )}
   >
     {breadcrumbs ? (
       <Breadcrumbs items={breadcrumbs} className="mb-4" />
     ) : null}

    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
     <div className="max-w-3xl">
       <h1 className="font-heading text-[clamp(2.25rem,5vw,4rem)] font-medium leading-none
tracking-[-0.04em]">
        {title}
       </h1>

       {description ? (
         <div className="mt-4 text-base leading-7 text-muted">
           {description}
         </div>
       ) : null}
      </div>

     {action ? <div>{action}</div> : null}
    </div>
   </header>
 );
}
