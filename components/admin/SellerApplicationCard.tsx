"use client";

import {
  ArrowRight,
  CalendarDays,
  Instagram,
  MapPin,
  PackageOpen,
} from "lucide-react";

import { SellerApplicationStatusBadge } from
"@/components/admin/SellerApplicationStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/date";
import type { SellerApplication } from "@/types/seller-application";

interface SellerApplicationCardProps {
  readonly application: SellerApplication;
  readonly onReview: (application: SellerApplication) => void;
}

export function SellerApplicationCard({
  application,
  onReview,
}: SellerApplicationCardProps): React.JSX.Element {
  return (
   <Card className="p-6">
     <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0">
       <div className="flex flex-wrap items-center gap-3">
         <h3 className="font-heading text-3xl font-medium tracking-[-0.03em]">
           {application.studioName}
         </h3>

       <SellerApplicationStatusBadge status={application.status} />
      </div>

 <p className="mt-2 text-sm font-medium text-foreground">
  {application.fullName}
 </p>

 <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
  <span className="inline-flex items-center gap-2">
   <MapPin aria-hidden="true" className="size-3.5" />
   {application.city}, {application.state}
  </span>

  <span className="inline-flex items-center gap-2">
   <CalendarDays aria-hidden="true" className="size-3.5" />
   Submitted {formatDate(application.createdAt)}
  </span>

  <span className="inline-flex items-center gap-2">
   <PackageOpen aria-hidden="true" className="size-3.5" />
   {application.expectedMonthlyCapacity.toLocaleString("en-IN")}{" "}
   pieces/month
  </span>

  {application.instagramURL ? (
    <a
      href={application.instagramURL}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 hover:text-foreground"
    >
      <Instagram aria-hidden="true" className="size-3.5" />
      Portfolio
    </a>
  ) : null}
 </div>

 <p className="mt-5 line-clamp-3 max-w-3xl text-sm leading-7 text-muted">
  {application.reasonToJoin}
 </p>
</div>

<Button
 variant="outline"
 className="shrink-0"
 onClick={() => onReview(application)}

     >
      Review Application
      <ArrowRight aria-hidden="true" className="size-4" />
     </Button>
    </div>
   </Card>
 );
}
