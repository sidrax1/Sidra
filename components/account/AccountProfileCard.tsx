import {
  BadgeCheck,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import { formatDate } from "@/lib/date";
import type { AccountProfile } from "@/types/account";

interface AccountProfileCardProps {
  readonly profile: AccountProfile;
}

export function AccountProfileCard({
  profile,
}: AccountProfileCardProps): React.JSX.Element {
  return (
    <Surface
      className="grid gap-6"
      shadow="hover"
    >
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            name={profile.displayName}
            src={profile.photoURL}
            size="xl"
          />

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
                {profile.displayName}
              </h2>

              {profile.emailVerified ? (
                <Badge variant="success">
                  <BadgeCheck
                    aria-hidden="true"
                    className="mr-1 size-3.5"
                  />
                  Verified
                </Badge>
              ) : (
                <Badge variant="warning">
                  Email Unverified
                </Badge>
              )}
            </div>

            <p className="mt-2 capitalize text-sm text-muted">
              {profile.role}
            </p>
          </div>
        </div>

        <Badge variant="gold">
          <ShieldCheck
            aria-hidden="true"
            className="mr-1 size-3.5"
          />
          Protected Account
        </Badge>
      </header>

      <dl className="grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
            <Mail
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Email
          </dt>

          <dd className="mt-2 break-all text-sm font-medium text-foreground">
            {profile.email}
          </dd>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
            <Phone
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Mobile
          </dt>

          <dd className="mt-2 text-sm font-medium text-foreground">
            {profile.phone ||
              "Not provided"}
          </dd>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
            <UserRound
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Member Since
          </dt>

          <dd className="mt-2 text-sm font-medium text-foreground">
            {formatDate(
              profile.createdAt
            )}
          </dd>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <dt className="text-xs uppercase tracking-[0.14em] text-muted">
            Preferred Language
          </dt>

          <dd className="mt-2 text-sm font-medium text-foreground">
            English
          </dd>
        </div>
      </dl>
    </Surface>
  );
}
