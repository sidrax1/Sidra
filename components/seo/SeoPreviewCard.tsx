import {
  Globe2,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface SeoPreviewCardProps {
  readonly title: string;
  readonly description: string;
  readonly canonicalPath: string;
  readonly domain?: string;
  readonly className?: string;
}

export function SeoPreviewCard({
  canonicalPath,
  className,
  description,
  domain = "sidra.in",
  title,
}: SeoPreviewCardProps): React.JSX.Element {
  const normalizedPath =
    canonicalPath.startsWith("/")
      ? canonicalPath
      : `/${canonicalPath}`;

 return (
  <section
    className={cn(
      "rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-[var(--shadow-card)]",
      className
    )}
  >
    <div className="flex items-center gap-3 text-sm text-muted">
      <span className="flex size-9 items-center justify-center rounded-full
bg-[var(--color-gray-100)] dark:bg-[var(--color-charcoal-800)]">
        <Globe2
         aria-hidden={true}
         className="size-4"
        />
      </span>

     <div>
      <p className="font-medium text-foreground">
       {domain}
      </p>

      <p className="text-xs">
       https://{domain}

          {normalizedPath}
        </p>
       </div>
      </div>

      <h3 className="mt-5 line-clamp-1 text-xl font-medium text-[#1a0dab] dark:text-[#8ab4f8]">
       {title ||
         "Untitled Sidra Page"}
      </h3>

    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
     {description ||
       "Add a clear and descriptive summary for this page."}
    </p>
   </section>
 );
}
