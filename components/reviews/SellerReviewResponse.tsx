import {
  BadgeCheck,
  MessageSquareReply,
  Store,
} from "lucide-react";

import {
  Avatar,
} from "@/components/ui/Avatar";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";

export interface SellerReviewResponseData {
  readonly id: string;
  readonly studioId: string;
  readonly studioName: string;
  readonly studioLogoURL?: string | null;
  readonly message: string;
  readonly createdAt: string;
  readonly updatedAt?: string;
  readonly verifiedStudio: boolean;
}

interface SellerReviewResponseProps {
  readonly response: SellerReviewResponseData;
  readonly className?: string;
}

export function SellerReviewResponse({
  className,
  response,
}: SellerReviewResponseProps): React.JSX.Element {
  return (
    <section
      aria-label="Studio response"
      className={cn(
        "ml-0 rounded-[var(--radius-lg)] border border-[color:rgb(200_169_106_/_0.28)]",
        "bg-[color:rgb(200_169_106_/_0.05)] p-5 sm:ml-12",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <Avatar
          name={
            response.studioName
          }
          src={
            response.studioLogoURL
          }
          size="sm"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              <Store
                aria-hidden={true}
                className="size-4 text-[var(--color-gold-600)]"
              />
              {response.studioName}
            </span>

            <Badge variant="gold">
              <MessageSquareReply
                aria-hidden={true}
                className="mr-1 size-3.5"
              />
              Studio Response
            </Badge>

            {response.verifiedStudio ? (
              <Badge variant="success">
                <BadgeCheck
                  aria-hidden={true}
                  className="mr-1 size-3.5"
                />
                Verified
              </Badge>
            ) : null}
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">
            {response.message}
          </p>

          <time className="mt-3 block text-xs text-muted">
            {response.updatedAt
              ? `Updated ${formatDateTime(
                  response.updatedAt
                )}`
              : formatDateTime(
                  response.createdAt
                )}
          </time>
        </div>
      </div>
    </section>
  );
}
