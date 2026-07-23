"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

interface PublicShellProps {
  readonly children: ReactNode;
}

export function PublicShell({
  children,
}: PublicShellProps): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

 return (
  <>
    <SiteHeader onMenuOpen={() => setMenuOpen(true)} />

      <MobileNavigation
       open={menuOpen}
       onClose={() => setMenuOpen(false)}
      />

      <main>{children}</main>

    <SiteFooter />
   </>
 );
}
