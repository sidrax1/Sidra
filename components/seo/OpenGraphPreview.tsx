import Image from "next/image";
import {
  Globe2,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface OpenGraphPreviewProps {
  readonly title: string;
  readonly description: string;
  readonly imageURL?: string;
  readonly domain?: string;
  readonly className?: string;
}

export function OpenGraphPreview({
 className,
 description,
 domain = "sidra.in",
 imageURL,

  title,
}: OpenGraphPreviewProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-lg)] border border-border bg-cardshadow-[var(--shadow-card)]",
        className
      )}
    >
      <div className="relative aspect-[1.91/1] bg-[var(--color-gray-100)]">
        {imageURL ? (
          <Image
           src={imageURL}
           alt=""
           fill
           sizes="600px"
           className="object-cover"
          />
        ):(
          <div className="flex size-full items-center justify-center
bg-[radial-gradient(circle_at_center,rgba(200,169,106,0.35),transparent_60%),linear-gradient(13
5deg,#111111,#1e1c19)]">
           <span className="font-heading text-5xl text-[var(--color-gold-500)]">
             Sidra
           </span>
          </div>
        )}
      </div>

    <div className="p-5">
     <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em]
text-muted">
      <Globe2
        aria-hidden={true}
        className="size-3.5"
      />
      {domain}
     </p>

      <h3 className="mt-3 line-clamp-2 font-heading text-2xl font-medium tracking-[-0.025em]
text-foreground">
       {title ||
         "Untitled Social Preview"}

      </h3>

     <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
       {description ||
        "Add a compelling summary for social sharing."}
     </p>
    </div>
   </section>
 );
}
