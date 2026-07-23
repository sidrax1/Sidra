"use client";

import Image from "next/image";
import {
 ArrowRight,

  CalendarRange,
  Pause,
  Play,
} from "lucide-react";

import { CampaignStatusBadge } from "@/components/campaign/CampaignStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/date";
import type { Campaign } from "@/types/campaign";

interface CampaignCardProps {
  readonly campaign: Campaign;
  readonly loading?: boolean;
  readonly onView: (
    campaign: Campaign
  ) => void;
  readonly onToggleStatus?: (
    campaign: Campaign
  ) => void | Promise<void>;
}

export function CampaignCard({
  campaign,
  loading = false,
  onToggleStatus,
  onView,
}: CampaignCardProps): React.JSX.Element {
  const canToggle =
    campaign.status === "active" ||
    campaign.status === "paused";

 return (
  <Card className="overflow-hidden">
    {campaign.heroImageURL ? (
     <div className="relative aspect-[16/7] overflow-hidden bg-[var(--color-gray-100)]">
      <Image
        src={campaign.heroImageURL}
        alt={campaign.name}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />

       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
     </div>
   ) : null}

   <div className="p-6">
    <div className="flex flex-wrap items-center gap-3">
     <CampaignStatusBadge
       status={campaign.status}
     />

     <span className="inline-flex items-center gap-2 text-xs text-muted">
      <CalendarRange
        aria-hidden="true"
        className="size-3.5"
      />
      {formatDate(
        campaign.startsAt
      )}{" "}
      –{" "}
      {formatDate(
        campaign.endsAt
      )}
     </span>
    </div>

      <h3 className="mt-4 font-heading text-3xl font-medium tracking-[-0.035em]
text-foreground">
       {campaign.name}
      </h3>

    <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted">
     {campaign.description ??
      campaign.headline}
    </p>

    <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
     <Button
      variant="outline"
      disabled={loading}
      onClick={() =>
        onView(campaign)
      }
     >
      Review Campaign

       <ArrowRight
        aria-hidden="true"
        className="size-4"
       />
      </Button>

      {canToggle &&
      onToggleStatus ? (
       <Button
        variant="ghost"
        disabled={loading}
        onClick={() => {
          void onToggleStatus(
            campaign
          );
        }}
       >
        {campaign.status ===
        "active" ? (
          <Pause
            aria-hidden="true"
            className="size-4"
          />
        ):(
          <Play
            aria-hidden="true"
            className="size-4"
          />
        )}

          {campaign.status ===
          "active"
           ? "Pause"
           : "Resume"}
        </Button>
      ) : null}
     </div>
    </div>
   </Card>
 );
}
