import Image from "next/image";
import {
  BadgeCheck,
  CalendarDays,
  Crown,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

interface AccountOverviewHeaderProps {
  readonly displayName: string;
  readonly email: string;
  readonly photoURL?: string | null;
  readonly memberSince: string;
  readonly verified?: boolean;
  readonly className?: string;
}

function resolveFirstName(
  displayName: string
): string {
  return (
    displayName
      .trim()
      .split(/\s+/)
      .at(0) || "Collector"
  );
}

export function AccountOverviewHeader({
  className,
  displayName,
  email,
  memberSince,
  photoURL,
  verified = false,
}: AccountOverviewHeaderProps): React.JSX.Element {
  const firstName =
    resolveFirstName(displayName);

  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border",
        "border-[color:rgb(200_169_106_/_0.28)] bg-[var(--color-black-900)]",
        "px-6 py-8 text-white shadow-[var(--shadow-hover)] md:px-9 md:py-10",
        className
      )}
    >
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 82% 14%, rgba(200,169,106,0.3), transparent 42%)",
        }}
      />

      <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-5">
          <div className="rounded-full border border-white/20 bg-white/10 p-1 shadow-[var(--shadow-gold-glow)] backdrop-blur-xl">
            <Avatar
              name={displayName}
              src={photoURL}
              size="xl"
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-500)]">
              Private Collector Account
            </p>

            <h1 className="mt-3 font-heading text-[clamp(2.6rem,6vw,5.2rem)] font-medium leading-[0.94] tracking-[-0.055em]">
              Welcome, {firstName}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
              <span className="truncate">
                {email}
              </span>

              <span className="hidden size-1 rounded-full bg-white/30 sm:block" />

              <span className="inline-flex items-center gap-2">
                <CalendarDays
                  aria-hidden={true}
                  className="size-4"
                />
                Member since{" "}
                {formatDate(memberSince)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Badge variant="gold">
            <Crown
              aria-hidden={true}
              className="mr-1 size-3.5"
            />
            Collector
          </Badge>

          {verified ? (
            <Badge variant="success">
              <BadgeCheck
                aria-hidden={true}
                className="mr-1 size-3.5"
              />
              Verified Account
            </Badge>
          ) : (
            <Badge variant="warning">
              Verification Pending
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}
