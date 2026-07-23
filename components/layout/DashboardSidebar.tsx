"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface DashboardNavigationItem {

    label: string;
    href: string;
    icon: LucideIcon;
}

interface DashboardSidebarProps {
  readonly title: string;
  readonly items: readonly DashboardNavigationItem[];
}

export function DashboardSidebar({
  items,
  title,
}: DashboardSidebarProps): React.JSX.Element {
  const pathname = usePathname();

  return (
   <aside className="hidden min-h-screen w-72 shrink-0 border-r border-border bg-card p-5
lg:block">
     <Link
      href="/"
      className="block px-3 py-4 font-heading text-3xl font-semibold tracking-[-0.04em]"
     >
      Sidra
     </Link>

      <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
       {title}
      </p>

      <nav className="mt-6 grid gap-1">
       {items.map((item) => {
         const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

         return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
             "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
             active
               ? "bg-[var(--color-gold-100)] text-[var(--color-gold-600)]"
               : "text-muted hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"

          )}
         >
          <item.icon aria-hidden="true" className="size-4" />
          {item.label}
         </Link>
       );
     })}
    </nav>
   </aside>
 );
}
