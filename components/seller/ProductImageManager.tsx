"use client";

import Image from "next/image";
import {
  GripVertical,
  ImagePlus,
  Star,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

interface ProductImageManagerProps {
  readonly images: readonly ProductImage[];
  readonly maximumImages?: number;
  readonly disabled?: boolean;
  readonly onAddImages: () => void;

    readonly onRemoveImage: (image: ProductImage) => void;
    readonly onSetPrimary: (image: ProductImage) => void;
    readonly onReorder: (
      sourceIndex: number,
      destinationIndex: number
    ) => void;
}

export function ProductImageManager({
  disabled = false,
  images,
  maximumImages = 10,
  onAddImages,
  onRemoveImage,
  onReorder,
  onSetPrimary,
}: ProductImageManagerProps): React.JSX.Element {
  return (
   <section className="grid gap-5">
     <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
       <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
         Product Imagery
       </h2>

        <p className="mt-2 text-sm text-muted">
         Add up to {maximumImages} premium product photographs.
        </p>
       </div>

       <Button
        variant="outline"
        disabled={disabled || images.length >= maximumImages}
        onClick={onAddImages}
       >
        <ImagePlus aria-hidden="true" />
        Add Images
       </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
       {images.map((image, index) => (
         <article
          key={image.id}

       draggable={!disabled}
       onDragStart={(event) => {
         event.dataTransfer.setData(
           "text/plain",
           String(index)
         );
       }}
       onDragOver={(event) => {
         event.preventDefault();
       }}
       onDrop={(event) => {
         event.preventDefault();

        const sourceIndex = Number(
          event.dataTransfer.getData("text/plain")
        );

         if (
           Number.isInteger(sourceIndex) &&
           sourceIndex !== index
         ){
           onReorder(sourceIndex, index);
         }
       }}
       className={cn(
         "group relative overflow-hidden rounded-[var(--radius-lg)] border bg-card",
         index === 0
           ? "border-[var(--color-gold-500)] shadow-[var(--shadow-gold-glow)]"
           : "border-border shadow-[var(--shadow-card)]"
       )}
      >
       <div className="relative aspect-square bg-[var(--color-gray-100)]">
         <Image
           src={image.url}
           alt={image.alt}
           fill
           sizes="(max-width: 640px) 100vw, 33vw"
           className="object-cover"
         />

        <div className="absolute left-3 top-3 flex items-center gap-2">
         <span className="flex size-9 cursor-grab items-center justify-center rounded-full
border border-white/20 bg-black/55 text-white backdrop-blur-md">
           <GripVertical

           aria-hidden="true"
           className="size-4"
          />
         </span>

          {index === 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border
border-[color:rgb(200_169_106_/_0.45)] bg-black/60 px-3 py-1.5 text-xs font-medium text-white
backdrop-blur-md">
              <Star
               aria-hidden="true"
               className="size-3.5 fill-[var(--color-gold-500)] text-[var(--color-gold-500)]"
              />
              Primary
            </span>
          ) : null}
         </div>

        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity
group-hover:opacity-100">
         {index !== 0 ? (
           <IconButton
             label="Set as primary image"
             icon={<Star aria-hidden="true" />}
             appearance="glass"
             size="sm"
             disabled={disabled}
             onClick={() => onSetPrimary(image)}
           />
         ) : null}

          <IconButton
            label="Remove image"
            icon={<Trash2 aria-hidden="true" />}
            appearance="glass"
            size="sm"
            disabled={disabled}
            onClick={() => onRemoveImage(image)}
          />
         </div>
        </div>
      </article>
    ))}

      {images.length < maximumImages ? (
        <button
         type="button"
         disabled={disabled}
         onClick={onAddImages}
         className="flex aspect-square flex-col items-center justify-center
rounded-[var(--radius-lg)] border-2 border-dashed border-border bg-card p-6 text-center
transition-[border-color,background-color] hover:border-[var(--color-gold-500)]
hover:bg-[color:rgb(200_169_106_/_0.05)] disabled:pointer-events-none disabled:opacity-45"
        >
         <span className="flex size-14 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
           <ImagePlus
            aria-hidden="true"
            className="size-6"
           />
         </span>

        <span className="mt-4 font-medium text-foreground">
         Add Product Image
        </span>

         <span className="mt-2 text-sm leading-6 text-muted">
          High-resolution square or portrait imagery works best.
         </span>
       </button>
     ) : null}
    </div>
   </section>
 );
}
