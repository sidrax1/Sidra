import type { ReactNode } from "react";

import { SellerApplicationCard } from "@/components/admin/SellerApplicationCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { SellerApplication } from "@/types/seller-application";

interface SellerApplicationListProps {
  readonly applications: readonly SellerApplication[];
  readonly emptyAction?: ReactNode;
  readonly onReview: (application: SellerApplication) => void;
}

export function SellerApplicationList({
  applications,
  emptyAction,
  onReview,
}: SellerApplicationListProps): React.JSX.Element {
  if (applications.length === 0) {
    return (
      <EmptyState
       title="No seller applications"
       description="Applications matching the selected status will appear here."
       action={emptyAction}
      />
    );
  }

 return (
  <div className="grid gap-4">

    {applications.map((application) => (
      <SellerApplicationCard
        key={application.id}
        application={application}
        onReview={onReview}
      />
    ))}
   </div>
 );
}
