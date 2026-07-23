import Link from "next/link";
import type {
  ReactNode,
} from "react";
import {
  ArrowUpRight,
  Gem,
  Heart,
  MapPin,
  PackageSearch,
  Store,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface AccountQuickAction {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly href: string;
  readonly icon: ReactNode;
}

interface AccountQuickActionsProps {
  readonly actions?: readonly AccountQuickAction[];
  readonly className?: string;
}

const defaultActions: readonly AccountQuickAction[] =
  [
    {
      id: "orders",
      label: "Track Orders",
      description:
        "Review fulfilment and delivery progress.",
      href: "/account/orders",
      icon: (
        <PackageSearch
          aria-hidden={true}
          className="size-5"
        />
      ),
    },
    {
      id: "wishlist",
      label: "Saved Pieces",
      description:
        "Return to pieces held in your private edit.",
      href: "/account/wishlist",
      icon: (
        <Heart
          aria-hidden={true}
          className="size-5"
        />
      ),
    },
    {
      id: "studios",
      label: "Followed Studios",
      description:
        "Enter the Studios you chose to follow.",
      href: "/account/saved-studios",
      icon: (
        <Store
          aria-hidden={true}
          className="size-5"
        />
      ),
    },
    {
      id: "custom-orders",
      label: "Private Commissions",
      description:
        "Manage bespoke resin requests and quotes.",
      href: "/account/custom-orders",
      icon: (
        <Gem
          aria-hidden={true}
          className="size-5"
        />
      ),
    },
    {
      id: "addresses",
      label: "Address Book",
      description:
        "Maintain secure delivery destinations.",
      href: "/account/addresses",
      icon: (
        <MapPin
          aria-hidden={true}
          className="size-5"
        />
      ),
    },
  ];

export function AccountQuickActions({
  actions = defaultActions,
  className,
}: AccountQuickActionsProps): React.JSX.Element {
  return (
    <section
      aria-label="Account quick actions"
      className={cn(
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {actions.map((action) => (
        <Link
          key={action.id}
          href={action.href}
          className={[
            "group rounded-[var(--radius-lg)] border border-border bg-card p-5",
            "shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow]",
            "duration-[var(--duration-base)] hover:-translate-y-1",
            "hover:border-[color:rgb(200_169_106_/_0.42)] hover:shadow-[var(--shadow-hover)]",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-4">
            <span className="flex size-11 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
              {action.icon}
            </span>

            <ArrowUpRight
              aria-hidden={true}
              className="size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-gold-600)]"
            />
          </div>

          <h2 className="mt-5 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            {action.label}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            {action.description}
          </p>
        </Link>
      ))}
    </section>
  );
}
