import type { ReactNode } from "react";

import { MediaAssetCard } from "@/components/media/MediaAssetCard";
import { EmptyState } from "@/components/ui/EmptyState";

import type { MediaAsset } from "@/types/media";

interface MediaAssetGridProps {
  readonly assets: readonly MediaAsset[];
  readonly selectedAssetIds?: ReadonlySet<string>;
  readonly loadingAssetIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
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

export function MediaAssetGrid({
  assets,
  emptyAction,
  loadingAssetIds,
  onCopyURL,
  onDelete,
  onSelect,
  selectedAssetIds,
}: MediaAssetGridProps): React.JSX.Element {
  if (assets.length === 0) {
    return (
      <EmptyState
       title="No media assets"
       description="Upload approved imagery, documents or editorial resources."
       action={emptyAction}
      />
    );
  }

 return (
  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
    {assets.map((asset) => (
     <MediaAssetCard
      key={asset.id}
      asset={asset}
      selected={

        selectedAssetIds?.has(
          asset.id
        ) ?? false
        }
        loading={
          loadingAssetIds?.has(
            asset.id
          ) ?? false
        }
        onSelect={onSelect}
        onCopyURL={onCopyURL}
        onDelete={onDelete}
      />
    ))}
   </div>
 );
}
