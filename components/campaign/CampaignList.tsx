import type { ReactNode } from "react";

import { CampaignCard } from "@/components/campaign/CampaignCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Campaign } from "@/types/campaign";

interface CampaignListProps {
  readonly campaigns: readonly Campaign[];
  readonly loadingCampaignIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onView: (
    campaign: Campaign
  ) => void;
  readonly onToggleStatus?: (
    campaign: Campaign
  ) => void | Promise<void>;
}

export function CampaignList({
  campaigns,
  emptyAction,
  loadingCampaignIds,
  onToggleStatus,
  onView,
}: CampaignListProps): React.JSX.Element {
  if (campaigns.length === 0) {
    return (
      <EmptyState
       title="No campaigns found"
       description="Create a campaign to coordinate curated products, studios and promotional
content."
       action={emptyAction}
      />
    );
  }

 return (
  <div className="grid gap-5 lg:grid-cols-2">
    {campaigns.map(
     (campaign) => (

      <CampaignCard
       key={campaign.id}
       campaign={campaign}
       loading={
         loadingCampaignIds?.has(
           campaign.id
         ) ?? false
       }
       onView={onView}
       onToggleStatus={
         onToggleStatus
       }
      />
      )
    )}
   </div>
 );
}
