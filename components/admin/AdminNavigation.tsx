"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
 BarChart3,
 Boxes,
 CircleDollarSign,
 FileText,
 LayoutDashboard,
 Megaphone,
 MessageSquareWarning,
 PackageCheck,
 Settings,
 ShieldCheck,
 Store,

  UserRoundCog,
  Users,
} from "lucide-react";

import { ADMIN_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const navigationItems = [
 {
   label: "Overview",
   href: ADMIN_ROUTES.OVERVIEW,
   icon: LayoutDashboard,
 },
 {
   label: "Users",
   href: ADMIN_ROUTES.USERS,
   icon: Users,
 },
 {
   label: "Seller Applications",
   href: ADMIN_ROUTES.SELLER_APPLICATIONS,
   icon: UserRoundCog,
 },
 {
   label: "Studios",
   href: ADMIN_ROUTES.STUDIOS,
   icon: Store,
 },
 {
   label: "Product Moderation",
   href: ADMIN_ROUTES.PRODUCTS,
   icon: Boxes,
 },
 {
   label: "Orders",
   href: ADMIN_ROUTES.ORDERS,
   icon: PackageCheck,
 },
 {
   label: "Payouts",
   href: ADMIN_ROUTES.PAYOUTS,
   icon: CircleDollarSign,
 },
 {

    label: "Content",
    href: ADMIN_ROUTES.CONTENT,
    icon: FileText,
  },
  {
    label: "Campaigns",
    href: ADMIN_ROUTES.CAMPAIGNS,
    icon: Megaphone,
  },
  {
    label: "Support",
    href: ADMIN_ROUTES.SUPPORT,
    icon: MessageSquareWarning,
  },
  {
    label: "Analytics",
    href: ADMIN_ROUTES.ANALYTICS,
    icon: BarChart3,
  },
  {
    label: "Audit Logs",
    href: ADMIN_ROUTES.AUDIT_LOGS,
    icon: ShieldCheck,
  },
  {
    label: "Settings",
    href: ADMIN_ROUTES.SETTINGS,
    icon: Settings,
  },
] as const;

interface AdminNavigationProps {
  readonly className?: string;
}

export function AdminNavigation({
  className,
}: AdminNavigationProps): React.JSX.Element {
  const pathname = usePathname();

 return (
  <nav
    aria-label="Administration navigation"
    className={cn(

         "grid gap-1 rounded-[var(--radius-lg)] border border-border bg-card p-3",
         "shadow-[var(--shadow-card)]",
         className
       )}
      >
       {navigationItems.map((item) => {
         const active =
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`);

    return (
      <Link
       key={item.href}
       href={item.href}
       aria-current={active ? "page" : undefined}
       className={cn(
         "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium",
         "transition-[background-color,color,transform] duration-[var(--duration-base)]",
         active
           ? "bg-[var(--color-gold-100)] text-[var(--color-gold-600)]"
           : "text-muted hover:translate-x-0.5 hover:bg-[color:rgb(200_169_106_/_0.07)]hover:text-foreground"
       )}
      >
       <item.icon
         aria-hidden={true}
         className="size-4 shrink-0"
       />

         {item.label}
        </Link>
      );
    })}
   </nav>
 );
}
