import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Banner } from "@/types/banner";

interface BannerPreviewProps {
  readonly banner: Banner;
  readonly className?: string;
}

export function BannerPreview({
  banner,
  className,
}: BannerPreviewProps): React.JSX.Element {
  return (
   <section

   className={cn(
     "relative isolate min-h-[520px] overflow-hidden rounded-[var(--radius-xl)]",
     "border border-[color:rgb(200_169_106_/_0.28)] bg-[var(--color-black-900)]",
     "shadow-[var(--shadow-modal)]",
     className
   )}
  >
   <picture>
     {banner.mobileImage ? (
       <source
         media="(max-width: 767px)"
         srcSet={banner.mobileImage}
       />
     ) : null}

    <Image
     src={banner.image}
     alt={banner.title}
     fill
     priority
     sizes="100vw"
     className="object-cover"
    />
   </picture>

     <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45
to-transparent" />

    <div className="relative z-10 flex min-h-[520px] max-w-3xl flex-col justify-center p-8
text-white md:p-14 lg:p-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em]
text-[var(--color-gold-500)]">
       Sidra Editorial
      </p>

     <h2 className="mt-5 font-heading text-[clamp(3rem,7vw,6rem)] font-medium
leading-[0.92] tracking-[-0.055em]">
      {banner.title}
     </h2>

     {banner.subtitle ? (
      <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
       {banner.subtitle}
      </p>

      ) : null}

     {banner.buttonLabel &&
     banner.buttonUrl ? (
       <Button
         asChild
         size="lg"
         className="mt-8 w-fit"
       >
         <Link
          href={banner.buttonUrl}
         >
          {banner.buttonLabel}
          <ArrowRight aria-hidden={true} />
         </Link>
       </Button>
     ) : null}
    </div>
   </section>
 );
}
