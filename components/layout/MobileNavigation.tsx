"use client";

import Link from "next/link";
import { X } from "lucide-react";

import { IconButton } from "@/components/ui/IconButton";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

const links = [
  { label: "Home", href: PUBLIC_ROUTES.HOME },
  { label: "Studios", href: PUBLIC_ROUTES.STUDIOS },
  { label: "Collections", href: "/collections" },
  { label: "Journal", href: PUBLIC_ROUTES.JOURNAL },
  { label: "Custom Orders", href: PUBLIC_ROUTES.CUSTOM_ORDERS },
  { label: "About", href: PUBLIC_ROUTES.ABOUT },
  { label: "Support", href: PUBLIC_ROUTES.SUPPORT },
] as const;

export function MobileNavigation({
 onClose,
 open,

}: MobileNavigationProps): React.JSX.Element {
  return (
   <div
     aria-hidden={!open}
     className={cn(
       "fixed inset-0 z-50 lg:hidden",
       open ? "pointer-events-auto" : "pointer-events-none"
     )}
   >
     <button
       type="button"
       aria-label="Close navigation"
       onClick={onClose}
       className={cn(
         "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
         open ? "opacity-100" : "opacity-0"
       )}
     />

    <aside
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      className={cn(
        "absolute right-0 top-0 flex h-full w-[min(88vw,420px)] flex-col border-lborder-[color:rgb(200_169_106_/_0.25)] bg-[var(--color-black-900)] p-6text-[var(--color-ivory-100)] shadow-[var(--shadow-modal)] transition-transformduration-[var(--duration-slow)]",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-heading text-3xl font-semibold">Sidra</span>

      <IconButton
       label="Close menu"
       icon={<X aria-hidden="true" />}
       appearance="ghost"
       onClick={onClose}
      />
     </div>

     <nav className="mt-12 grid gap-2" aria-label="Mobile navigation">
      {links.map((link) => (

        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="rounded-md px-4 py-3 text-lg transition-colors hover:bg-white/5
hover:text-[var(--color-gold-500)]"
        >
          {link.label}
        </Link>
      ))}
    </nav>

     <p className="mt-auto border-t border-white/10 pt-6 text-sm leading-6 text-white/60">
       Extraordinary craftsmanship, presented with restraint.
     </p>
    </aside>
   </div>
 );
}
