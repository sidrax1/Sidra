import type { ReactNode } from "react";

import { BannerCard } from "@/components/banner/BannerCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Banner } from "@/types/banner";

interface BannerListProps {
  readonly banners: readonly Banner[];
  readonly loadingBannerIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onEdit: (
    banner: Banner
  ) => void;
  readonly onToggleActive: (
    banner: Banner
  ) => void | Promise<void>;
  readonly onDelete: (
    banner: Banner
  ) => void | Promise<void>;
}

export function BannerList({
  banners,
  emptyAction,
  loadingBannerIds,
  onDelete,
  onEdit,
  onToggleActive,
}: BannerListProps): React.JSX.Element {
  if (banners.length === 0) {

      return (
        <EmptyState
         title="No campaign banners"
         description="Create premium promotional banners for key marketplace moments."
         action={emptyAction}
        />
      );
 }

 return (
   <div className="grid gap-5">
    {banners.map((banner) => (
      <BannerCard
        key={banner.id}
        banner={banner}
        loading={
          loadingBannerIds?.has(
            banner.id
          ) ?? false
        }
        onEdit={onEdit}
        onToggleActive={
          onToggleActive
        }
        onDelete={onDelete}
      />
    ))}
   </div>
 );
}
