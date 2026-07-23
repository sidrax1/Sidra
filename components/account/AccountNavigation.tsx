"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Heart,
  History,
  House,
  MapPin,
  Package,
  Settings,
  Shield,
  Star,
  UserRound,
} from "lucide-react";

import { ACCOUNT_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const navigationItems = [
 {
   label: "Overview",
   href: ACCOUNT_ROUTES.OVERVIEW,
   icon: House,
 },
 {
   label: "Orders",
   href: ACCOUNT_ROUTES.ORDERS,
   icon: Package,
 },
 {
   label: "Wishlist",

    href: ACCOUNT_ROUTES.WISHLIST,
    icon: Heart,
  },
  {
    label: "Addresses",
    href: ACCOUNT_ROUTES.ADDRESSES,
    icon: MapPin,
  },
  {
    label: "Custom Orders",
    href: ACCOUNT_ROUTES.CUSTOM_ORDERS,
    icon: Star,
  },
  {
    label: "Reviews",
    href: ACCOUNT_ROUTES.REVIEWS,
    icon: Star,
  },
  {
    label: "Recently Viewed",
    href: ACCOUNT_ROUTES.RECENTLY_VIEWED,
    icon: History,
  },
  {
    label: "Notifications",
    href: ACCOUNT_ROUTES.NOTIFICATIONS,
    icon: Bell,
  },
  {
    label: "Profile",
    href: ACCOUNT_ROUTES.PROFILE,
    icon: UserRound,
  },
  {
    label: "Security",
    href: ACCOUNT_ROUTES.SECURITY,
    icon: Shield,
  },
] as const;

interface AccountNavigationProps {
  readonly className?: string;
}

export function AccountNavigation({
  className,
}: AccountNavigationProps): React.JSX.Element {
  const pathname = usePathname();

 return (
   <nav
    aria-label="Account navigation"
    className={cn(
      "grid gap-1 rounded-[var(--radius-lg)] border border-border bg-card p-3",
      "shadow-[var(--shadow-card)]",
      className
    )}
   >
    <div className="mb-2 flex items-center gap-3 px-3 py-3">
      <span className="flex size-10 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
       <Settings
         aria-hidden="true"
         className="size-4"
       />
      </span>

     <div>
      <p className="font-heading text-xl font-medium text-foreground">
       Your Account
      </p>

     <p className="text-xs text-muted">
       Manage your Sidra experience
     </p>
    </div>
   </div>

   {navigationItems.map((item) => {
    const active =
     pathname === item.href ||
     pathname.startsWith(
       `${item.href}/`
     );

     return (
      <Link

       key={item.href}
       href={item.href}
       aria-current={
         active
           ? "page"
           : undefined
       }
       className={cn(
         "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium",
         "transition-[background-color,color,transform] duration-[var(--duration-base)]",
         active
           ? "bg-[var(--color-gold-100)] text-[var(--color-gold-600)]"
           : "text-muted hover:translate-x-0.5 hover:bg-[color:rgb(200_169_106_/_0.07)]hover:text-foreground"
       )}
      >
       <item.icon
         aria-hidden="true"
         className="size-4 shrink-0"
       />

         <span>{item.label}</span>
        </Link>
      );
    })}
   </nav>
 );
}
