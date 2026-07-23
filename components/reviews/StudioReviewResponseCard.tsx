import {
  BadgeCheck,
  Store,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";

export interface StudioReviewResponse {
  readonly id: string;
  readonly reviewId: string;
  readonly studioId: string;
  readonly studioName: string;
  readonly studioLogoURL?: string | null;
  readonly response: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface StudioReviewResponseCardProps {
  readonly response: StudioReviewResponse;
  readonly className?: string;
}

export function StudioReviewResponseCard({
  className,
  response,
}: StudioReviewResponseCardProps): React.JSX.Element {
  return (
    <article
      className={cn(
        "ml-0 rounded-[var(--radius-lg)] border border-[color:rgb(200_169_106_/_0.26)]",
        "bg-[color:rgb(200_169_106_/_0.05)] p-5 sm:ml-14",
        className
      )}
    >
      <header className="flex items-start gap-4">
        <Avatar
          name={response.studioName}
          src={
            response.studioLogoURL
          }
          size="sm"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="inline-flex items-center gap-2 font-medium text-foreground">
              <Store
                aria-hidden="true"
                className="size-4 text-[var(--color-gold-600)]"
              />
              {response.studioName}
            </h3>

            <Badge variant="gold">
              <BadgeCheck
                aria-hidden="true"
                className="mr-1 size-3.5"
              />
              Studio Response
            </Badge>
          </div>

          <time className="mt-2 block text-xs text-muted">
            {formatDateTime(
              response.createdAt
            )}
          </time>
        </div>
      </header>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted">
        {response.response}
      </p>

      {response.updatedAt !==
      response.createdAt ? (
        <p className="mt-3 text-[11px] text-muted">
          Edited{" "}
          {formatDateTime(
            response.updatedAt
          )}
        </p>
      ) : null}
    </article>
  );
}
