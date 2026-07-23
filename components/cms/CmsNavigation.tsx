"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  FileStack,
  HelpCircle,
  Image,
  LayoutTemplate,
  Megaphone,
  Newspaper,
  SearchCheck,
} from "lucide-react";

import { ADMIN_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const navigationItems = [

 {
    label: "Pages",
    href: ADMIN_ROUTES.CONTENT_PAGES,
    icon: FileStack,
  },
  {
    label: "Page Sections",
    href: ADMIN_ROUTES.CONTENT_SECTIONS,
    icon: LayoutTemplate,
  },
  {
    label: "Journal",
    href: ADMIN_ROUTES.JOURNAL,
    icon: Newspaper,
  },
  {
    label: "Banners",
    href: ADMIN_ROUTES.BANNERS,
    icon: Image,
  },
  {
    label: "Campaign Content",
    href: ADMIN_ROUTES.CAMPAIGNS,
    icon: Megaphone,
  },
  {
    label: "SEO",
    href: ADMIN_ROUTES.SEO,
    icon: SearchCheck,
  },
  {
    label: "FAQs",
    href: ADMIN_ROUTES.FAQ,
    icon: HelpCircle,
  },
  {
    label: "Editorial Library",
    href: ADMIN_ROUTES.MEDIA,
    icon: BookOpenText,
  },
] as const;

interface CmsNavigationProps {
  readonly className?: string;

}

export function CmsNavigation({
  className,
}: CmsNavigationProps): React.JSX.Element {
  const pathname = usePathname();

    return (
     <nav
       aria-label="Content management navigation"
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
         aria-hidden="true"
         className="size-4 shrink-0"
       />

           {item.label}
          </Link>
        );
      })}

   </nav>
 );
}
