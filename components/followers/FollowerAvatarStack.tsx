import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

export interface FollowerAvatar {
  readonly id: string;
  readonly name: string;
  readonly photoURL?: string | null;
}

interface FollowerAvatarStackProps {
  readonly followers: readonly FollowerAvatar[];
  readonly totalCount?: number;
  readonly maximumVisible?: number;
  readonly className?: string;
}

export function FollowerAvatarStack({
  className,
  followers,
  maximumVisible = 4,
  totalCount = followers.length,
}: FollowerAvatarStackProps): React.JSX.Element {
  const visible = followers.slice(
    0,
    maximumVisible
  );

  const remaining = Math.max(
    totalCount - visible.length,
    0
  );

  return (
    <div
      className={cn(
        "flex items-center",
        className
      )}
      aria-label={`${totalCount} studio followers`}
    >
      {visible.map(
        (follower, index) => (
          <div
            key={follower.id}
            className={cn(
              "rounded-full border-2 border-card",
              index > 0 && "-ml-3"
            )}
          >
            <Avatar
              name={follower.name}
              src={follower.photoURL}
              size="sm"
            />
          </div>
        )
      )}

      {remaining > 0 ? (
        <span className="-ml-3 flex size-9 items-center justify-center rounded-full border-2 border-card bg-[var(--color-black-900)] text-[10px] font-semibold text-white">
          +{remaining > 99
            ? "99"
            : remaining}
        </span>
      ) : null}
    </div>
  );
}
