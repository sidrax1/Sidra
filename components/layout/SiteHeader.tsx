"use client";

import Link from "next/link";
import { Menu, ShoppingBag, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

import { IconButton } from "@/components/ui/IconButton";
import { Container } from "@/components/ui/Container";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  readonly onMenuOpen?: () => void;
}

export function SiteHeader({
  onMenuOpen,
}: SiteHeaderProps): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false);

 useEffect(() => {
  const update = (): void => {
    setScrolled(window.scrollY > 24);
  };

      update();
      window.addEventListener("scroll", update, { passive: true });

   return () => window.removeEventListener("scroll", update);
 }, []);

 return (
  <header

   className={cn(
     "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter]duration-[var(--duration-slow)]",
     scrolled
       ? "border-b border-border bg-[color:rgb(247_244_239_/_0.88)] backdrop-blur-xldark:bg-[color:rgb(17_17_17_/_0.88)]"
       : "border-b border-transparent bg-transparent"
   )}
  >
   <Container className="flex h-20 items-center justify-between">
     <Link
       href={PUBLIC_ROUTES.HOME}
       className="font-heading text-3xl font-semibold tracking-[-0.04em] text-foreground"
       aria-label="Sidra home"
     >
       Sidra
     </Link>

     <nav
      aria-label="Primary navigation"
      className="hidden items-center gap-8 lg:flex"
     >
      <Link href={PUBLIC_ROUTES.STUDIOS}>Studios</Link>
      <Link href="/collections">Collections</Link>
      <Link href={PUBLIC_ROUTES.JOURNAL}>Journal</Link>
      <Link href={PUBLIC_ROUTES.CUSTOM_ORDERS}>Custom Orders</Link>
      <Link href={PUBLIC_ROUTES.ABOUT}>About</Link>
     </nav>

     <div className="flex items-center gap-1">
      <IconButton
       label="Your account"
       icon={<UserRound aria-hidden={true} />}
       appearance="ghost"
      />

      <IconButton
       label="Your cart"
       icon={<ShoppingBag aria-hidden={true} />}
       appearance="ghost"
      />

      <IconButton
       label="Open menu"

       icon={<Menu aria-hidden={true} />}
       appearance="ghost"
       className="lg:hidden"
       onClick={onMenuOpen}
      />
     </div>
    </Container>
   </header>
 );
}
