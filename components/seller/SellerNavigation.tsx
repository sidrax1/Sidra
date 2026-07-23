"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  Boxes,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  MessageSquare,
  PackageCheck,
  Palette,
  Settings,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";

import { SELLER_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const navigationItems = [
 {
   label: "Overview",
   href: SELLER_ROUTES.OVERVIEW,
   icon: LayoutDashboard,
 },
 {
   label: "Products",
   href: SELLER_ROUTES.PRODUCTS,
   icon: Boxes,
 },
 {
   label: "Orders",
   href: SELLER_ROUTES.ORDERS,
   icon: ShoppingBag,
 },
 {
   label: "Inventory",
   href: SELLER_ROUTES.INVENTORY,
   icon: PackageCheck,
 },
 {
   label: "Custom Orders",
   href: SELLER_ROUTES.CUSTOM_ORDERS,
   icon: FileText,
 },

 {
    label: "Customers",
    href: SELLER_ROUTES.CUSTOMERS,
    icon: Users,
  },
  {
    label: "Messages",
    href: SELLER_ROUTES.MESSAGES,
    icon: MessageSquare,
  },
  {
    label: "Analytics",
    href: SELLER_ROUTES.ANALYTICS,
    icon: BarChart3,
  },
  {
    label: "Payouts",
    href: SELLER_ROUTES.PAYOUTS,
    icon: CircleDollarSign,
  },
  {
    label: "Store Design",
    href: SELLER_ROUTES.STORE_DESIGN,
    icon: Palette,
  },
  {
    label: "Studio Profile",
    href: SELLER_ROUTES.STUDIO,
    icon: Store,
  },
  {
    label: "Settings",
    href: SELLER_ROUTES.SETTINGS,
    icon: Settings,
  },
] as const;

interface SellerNavigationProps {
  readonly className?: string;
}

export function SellerNavigation({
  className,
}: SellerNavigationProps): React.JSX.Element {

 const pathname = usePathname();

 return (
  <nav
    aria-label="Seller navigation"
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

         <span>{item.label}</span>
        </Link>
      );
    })}
   </nav>
 );
}
