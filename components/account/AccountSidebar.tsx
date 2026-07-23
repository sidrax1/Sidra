"use client";

import Link from "next/link";
import {
  Bell,
  Gem,
  Heart,
  Home,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  Store,
  UserRound,
} from "lucide-react";
import {
  usePathname,
} from "next/navigation";

import { cn } from "@/lib/utils";

interface AccountNavigationItem {
  readonly label: string;
  readonly href: string;
  readonly icon: React.ComponentType<{
    readonly className?: string;
    readonly "aria-hidden"?: boolean;
  }>;
}

const navigationItems: readonly AccountNavigationItem[] =
  [
    {
      label: "Overview",
      href: "/account/overview",
      icon: Home,
    },
    {
      label: "Orders",
      href: "/account/orders",
      icon: Package,
    },
    {
      label: "Wishlist",
      href: "/account/wishlist",
      icon: Heart,
    },
    {
      label: "Followed Studios",
      href: "/account/saved-studios",
      icon: Store,
    },
    {
      label: "Private Commissions",
      href: "/account/custom-orders",
      icon: Gem,
    },
    {
      label: "Reviews",
      href: "/account/reviews",
      icon: Star,
    },
    {
      label: "Addresses",
      href: "/account/addresses",
      icon: MapPin,
    },
    {
      label: "Notifications",
      href: "/account/notifications",
      icon: Bell,
    },
    {
      label: "Profile",
      href: "/account/profile",
      icon: UserRound,
    },
    {
      label: "Security",
      href: "/account/security",
      icon: ShieldCheck,
    },
  ];

export function AccountSidebar(): React.JSX.Element {
  const pathname =
    usePathname();

  return (
    <nav
      aria-label="Account navigation"
      className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]"
    >
      <div className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Your Sydra
        </p>

        <h2 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          Private Account
        </h2>
      </div>

      <ul className="grid gap-1 p-3">
        {navigationItems.map(
          (item) => {
            const active =
              pathname ===
                item.href ||
              pathname.startsWith(
                `${item.href}/`
              );

            const Icon =
              item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-md)] px-4 py-3",
                    "text-sm font-medium transition-[background-color,color,transform]",
                    active
                      ? "bg-[var(--color-gold-100)] text-[var(--color-gold-600)]"
                      : "text-muted hover:translate-x-0.5 hover:bg-background hover:text-foreground"
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0"
                  />

                  <span>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          }
        )}
      </ul>
    </nav>
  );
}
