"use client";

import {
  useMemo,
  useState,
} from "react";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { MediaAssetGrid } from "@/components/media/MediaAssetGrid";
import { SearchInput } from "@/components/ui/SearchInput";
import { normalizeSearchText } from "@/lib/search-normalization";
import type { MediaAsset } from "@/types/media";

interface MediaSelectionDialogProps {
  readonly open: boolean;
  readonly assets: readonly MediaAsset[];
  readonly multiple?: boolean;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onConfirm: (
    assets: readonly MediaAsset[]
  ) => void;
}

export function MediaSelectionDialog({
  assets,
  loading = false,
  multiple = false,
  onConfirm,
  onOpenChange,
  open,
}: MediaSelectionDialogProps): React.JSX.Element {
  const [query, setQuery] =

 useState("");

const [
  selectedAssetIds,
  setSelectedAssetIds,
] = useState<Set<string>>(
  new Set()
);

const filteredAssets =
 useMemo(() => {
  const normalizedQuery =
   normalizeSearchText(query);

  if (!normalizedQuery) {
    return assets;
  }

   return assets.filter(
     (asset) =>
      normalizeSearchText(
        [
          asset.originalFileName,
          asset.fileName,
          asset.altText,
          asset.mimeType,
        ]
          .filter(Boolean)
          .join(" ")
      ).includes(
        normalizedQuery
      )
   );
 }, [assets, query]);

const selectedAssets =
 assets.filter((asset) =>
   selectedAssetIds.has(
     asset.id
   )
 );

return (
 <Dialog

 open={open}
 onOpenChange={
   onOpenChange
 }
>
 <DialogContent className="max-w-6xl">
   <DialogHeader>
    <DialogTitle>
     Select Media
    </DialogTitle>

   <DialogDescription>
    Choose approved assets from the Sidra media library.
   </DialogDescription>
  </DialogHeader>

  <SearchInput
   value={query}
   disabled={loading}
   placeholder="Search media..."
   onChange={(event) =>
     setQuery(
       event.target.value
     )
   }
   onClear={() =>
     setQuery("")
   }
  />

  <div className="max-h-[60vh] overflow-y-auto pr-1">
   <MediaAssetGrid
    assets={filteredAssets}
    selectedAssetIds={
      selectedAssetIds
    }
    onSelect={(asset) => {
      setSelectedAssetIds(
       (current) => {
         const next =
          multiple
           ? new Set(current)
           : new Set<string>();

      if (
        next.has(asset.id)
      ){
        next.delete(
           asset.id
        );
      } else {
        next.add(asset.id);
      }

      return next;
      }
    );
  }}
  onCopyURL={() =>
    Promise.resolve()
  }
  onDelete={() =>
    Promise.resolve()
  }
 />
</div>

<DialogFooter>
 <Button
  variant="ghost"
  disabled={loading}
  onClick={() =>
    onOpenChange(false)
  }
 >
  Cancel
 </Button>

 <Button
  disabled={
    selectedAssets.length ===
    0
  }
  onClick={() => {
    onConfirm(
      selectedAssets
    );
    onOpenChange(false);

        }}
      >
        Use Selected Media
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>
 );
}
