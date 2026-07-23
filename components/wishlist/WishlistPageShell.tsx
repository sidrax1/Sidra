import type {
  ReactNode,
} from "react";

import {
  WishlistHeader,
} from "@/components/wishlist/WishlistHeader";

import {
  Container,
} from "@/components/ui/Container";

interface WishlistPageShellProps {
  readonly itemCount: number;
  readonly children: ReactNode;
}

export function WishlistPageShell({
  children,
  itemCount,
}: WishlistPageShellProps): React.JSX.Element {
  return (
    <Container
     as="section"
     spacing="lg"
     className="min-h-[70vh]"

      >
       <WishlistHeader
        itemCount={itemCount}
       />

    <div className="mt-10">
     {children}
    </div>
   </Container>
 );
}
