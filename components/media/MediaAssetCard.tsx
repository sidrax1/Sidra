"use client";

import Image from "next/image";
import {
 Check,
 Copy,

  FileText,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { IconButton } from "@/components/ui/IconButton";
import { bytesToReadableSize } from "@/utils/file";
import { cn } from "@/lib/utils";
import type { MediaAsset } from "@/types/media";

interface MediaAssetCardProps {
  readonly asset: MediaAsset;
  readonly selected?: boolean;
  readonly loading?: boolean;
  readonly onSelect?: (
    asset: MediaAsset
  ) => void;
  readonly onCopyURL: (
    asset: MediaAsset
  ) => void | Promise<void>;
  readonly onDelete: (
    asset: MediaAsset
  ) => void | Promise<void>;
}

export function MediaAssetCard({
  asset,
  loading = false,
  onCopyURL,
  onDelete,
  onSelect,
  selected = false,
}: MediaAssetCardProps): React.JSX.Element {
  const isImage =
    asset.mimeType.startsWith(
     "image/"

  );

 return (
  <article
    className={cn(
      "group overflow-hidden rounded-[var(--radius-lg)] border bg-card",
      "shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform]",
      "duration-[var(--duration-base)] hover:-translate-y-0.5",
      selected
        ? "border-[var(--color-gold-500)] shadow-[var(--shadow-gold-glow)]"
        : "border-border hover:border-[color:rgb(200_169_106_/_0.38)]hover:shadow-[var(--shadow-hover)]"
    )}
  >
    <button
      type="button"
      disabled={!onSelect || loading}
      onClick={() => onSelect?.(asset)}
      className="relative block aspect-square w-full overflow-hidden bg-[var(--color-gray-100)]"
    >
      {isImage ? (
        <Image
          src={asset.downloadURL}
          alt={
            asset.altText ??
            asset.originalFileName
          }
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-[var(--duration-slow)]
group-hover:scale-[1.035]"
        />
      ):(
        <div className="flex size-full flex-col items-center justify-center gap-3 text-muted">
          <FileText
            aria-hidden="true"
            className="size-10"
          />
          <span className="max-w-[80%] truncate text-sm">
            {asset.originalFileName}
          </span>
        </div>
      )}

    {selected ? (
      <span className="absolute left-3 top-3 flex size-8 items-center justify-center
rounded-full bg-[var(--color-gold-500)] text-[var(--color-black-900)]
shadow-[var(--shadow-card)]">
        <Check
         aria-hidden="true"
         className="size-4"
        />
      </span>
    ) : null}
   </button>

   <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 p-4">
    <div className="min-w-0">
     <p className="truncate text-sm font-medium text-foreground">
       {asset.originalFileName}
     </p>

      <div className="mt-2 flex items-center gap-2">
       <Badge variant="neutral">
        {asset.mimeType}
       </Badge>

       <span className="text-xs text-muted">
         {bytesToReadableSize(
           asset.sizeBytes
         )}
       </span>
      </div>
     </div>

     <DropdownMenu>
      <DropdownMenuTrigger>
       <IconButton
        label={`Actions for ${asset.originalFileName}`}
        icon={
          <MoreHorizontal aria-hidden="true" />
        }
        appearance="ghost"
        size="sm"
        disabled={loading}
       />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
       <DropdownMenuItem
        onSelect={() => {
          void onCopyURL(asset);
        }}
       >
        <Copy
          aria-hidden="true"
          className="size-4"
        />
        Copy URL
       </DropdownMenuItem>

       <DropdownMenuSeparator />

         <DropdownMenuItem
          destructive
          onSelect={() => {
            void onDelete(asset);
          }}
         >
          <Trash2
            aria-hidden="true"
            className="size-4"
          />
          Delete Asset
         </DropdownMenuItem>
       </DropdownMenuContent>
     </DropdownMenu>
    </div>
   </article>
 );
}
