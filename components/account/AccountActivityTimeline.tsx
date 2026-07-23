import {
  Gem,
  Heart,
  KeyRound,
  LogIn,
  MapPin,
  PackageCheck,
  Star,
  Store,
  UserRound,
} from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type {
  AccountActivity,
  AccountActivityType,
} from "@/types/account";

interface AccountActivityTimelineProps {
  readonly activities: readonly AccountActivity[];
  readonly className?: string;
}

const activityIcons: Record<
  AccountActivityType,
  React.ComponentType<{
    readonly className?: string;
    readonly "aria-hidden"?: boolean;
  }>
> = {
  login: LogIn,
  profileUpdated: UserRound,
  passwordChanged: KeyRound,
  addressAdded: MapPin,
  orderPlaced: PackageCheck,
  reviewSubmitted: Star,
  studioFollowed: Store,
  customOrderSubmitted: Gem,
};

export function AccountActivityTimeline({
  activities,
  className,
}: AccountActivityTimelineProps): React.JSX.Element {
  if (activities.length === 0) {
    return (
      <EmptyState
        title="No account activity"
        description="Protected account events will appear here as you use Sydra."
      />
    );
  }

  const orderedActivities = [
    ...activities,
  ].sort((first, second) =>
    second.createdAt.localeCompare(
      first.createdAt
    )
  );

  return (
    <section
      aria-label="Account activity"
      className={cn(
        "relative grid gap-4",
        className
      )}
    >
      <div
        aria-hidden={true}
        className="absolute bottom-6 left-[1.35rem] top-6 hidden w-px bg-border sm:block"
      />

      {orderedActivities.map(
        (activity) => {
          const Icon =
            activityIcons[
              activity.type
            ];

          return (
            <article
              key={activity.id}
              className="relative rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:ml-14"
            >
              <span className="absolute -left-[3.55rem] top-5 hidden size-11 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-card text-[var(--color-gold-600)] shadow-[var(--shadow-card)] sm:flex">
                <Icon
                  aria-hidden={true}
                  className="size-5"
                />
              </span>

              <div className="flex items-start gap-4 sm:hidden">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
                  <Icon
                    aria-hidden={true}
                    className="size-4"
                  />
                </span>

                <div className="min-w-0">
                  <h3 className="font-medium text-foreground">
                    {activity.title}
                  </h3>
                </div>
              </div>

              <h3 className="hidden font-medium text-foreground sm:block">
                {activity.title}
              </h3>

              {activity.description ? (
                <p className="mt-2 text-sm leading-6 text-muted">
                  {activity.description}
                </p>
              ) : null}

              <time className="mt-3 block text-xs text-muted">
                {formatDateTime(
                  activity.createdAt
                )}
              </time>
            </article>
          );
        }
      )}
    </section>
  );
}
