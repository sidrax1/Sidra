"use client";

import Image from "next/image";
import {
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

interface ProductGalleryProps {
  readonly images: readonly ProductImage[];
  readonly productTitle: string;
  readonly className?: string;
}

export function ProductGallery({
  className,
  images,
  productTitle,
}: ProductGalleryProps): React.JSX.Element {

 const sortedImages =
  useMemo(
    () => [...images],
    [images]
  );

 const [
   activeImageId,
   setActiveImageId,
 ] = useState<string | null>(
   sortedImages.at(0)?.id ??
    null
 );

 const activeImage =
  sortedImages.find(
    (image) =>
      image.id === activeImageId
  ) ??
  sortedImages.at(0) ??
  null;

 if (!activeImage) {
   return (
     <div
       className={cn(
         "flex aspect-square items-center justify-center rounded-[var(--radius-lg)]",
         "border border-borderbg-[linear-gradient(135deg,var(--color-ivory-50),var(--color-gold-100))]",
         className
       )}
     >
       <span className="font-heading text-5xl text-[var(--color-gold-600)]">
         Sidra
       </span>
     </div>
   );
 }

 return (
  <section
    aria-label={`${productTitle} image gallery`}
    className={cn(
     "grid gap-4",

     className
   )}
  >
   <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] border
border-border bg-[var(--color-gray-100)] shadow-[var(--shadow-card)]">
     <Image
      key={activeImage.id}
      src={activeImage.url}
      alt={
        activeImage.alt ||
        productTitle
      }
      fill
      priority
      sizes="(max-width: 1024px) 100vw, 55vw"
      className="object-cover animate-in fade-in-0 zoom-in-[0.985]
duration-[var(--duration-slow)]"
     />
   </div>

   {sortedImages.length > 1 ? (
    <div
     role="list"
     aria-label="Product thumbnails"
     className="grid grid-cols-5 gap-3 sm:grid-cols-6"
    >
     {sortedImages.map(
       (image) => {
         const active =
          image.id ===
          activeImage.id;

        return (
         <button
           key={image.id}
           type="button"
           role="listitem"
           aria-label={`View ${image.alt || productTitle}`}
           aria-pressed={active}
           onClick={() =>
             setActiveImageId(
               image.id
             )
           }

            className={cn(
              "relative aspect-square overflow-hidden rounded-md border",
              "bg-[var(--color-gray-100)] outline-none",
              "transition-[border-color,box-shadow,transform] duration-[var(--duration-base)]",
              "hover:-translate-y-0.5",
              active
                ? "border-[var(--color-gold-500)] shadow-[var(--shadow-gold-glow)]"
                : "border-border hover:border-[color:rgb(200_169_106_/_0.48)]",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
           >
            <Image
              src={image.url}
              alt=""
              fill
              sizes="120px"
              className="object-cover"
            />
           </button>
         );
          }
        )}
      </div>
    ) : null}
   </section>
 );
}
