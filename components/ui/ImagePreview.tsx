"use client";

import {
  useEffect,
  useMemo,
} from "react";

import {
  X,
} from "lucide-react";

import {
  IconButton,
} from "@/components/ui/IconButton";

import {
  cn,
} from "@/lib/utils";

interface ImagePreviewProps {
  readonly file: File;
  readonly alt?: string;
  readonly onRemove?: () => void;
  readonly className?: string;
}

export function ImagePreview({
  alt,
  className,
  file,
  onRemove,
}: ImagePreviewProps): React.JSX.Element {
  const previewUrl = useMemo(
    () => URL.createObjectURL(file),
    [file]
  );

 useEffect(() => {
   return () => {
     URL.revokeObjectURL(
       previewUrl
     );
   };
 }, [previewUrl]);

 return (
  <figure
    className={cn(
     "group relative overflow-hidden rounded-lg border border-border bg-cardshadow-[var(--shadow-card)]",
     className

       )}
      >
       <img
         src={previewUrl}
         alt={alt ?? file.name}
         className="aspect-square w-full object-cover"
       />

   <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4
bg-gradient-to-t from-black/80 via-black/35 to-transparent p-4 pt-12 text-white">
     <div className="min-w-0">
      <p className="truncate text-sm font-medium">
       {file.name}
      </p>

         <p className="mt-1 text-xs text-white/65">
          {file.type}
         </p>
        </div>

      {onRemove ? (
        <IconButton
          label={`Remove ${file.name}`}
          icon={<X aria-hidden="true" />}
          appearance="glass"
          size="sm"
          onClick={onRemove}
        />
      ) : null}
    </figcaption>
   </figure>
 );
}
