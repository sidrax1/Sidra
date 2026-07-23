import type {
  ReactNode,
} from "react";

import {
  Container,
} from "@/components/ui/Container";

import {
  SectionHeading,
} from "@/components/ui/SectionHeading";

import {
  SplitLayout,
} from "@/components/layout/SplitLayout";

import {
  cn,
} from "@/lib/utils";

interface CartPageShellProps {

    readonly itemCount: number;
    readonly items: ReactNode;
    readonly summary: ReactNode;
    readonly className?: string;
}

export function CartPageShell({
  className,
  itemCount,
  items,
  summary,
}: CartPageShellProps): React.JSX.Element {
  return (
    <Container
     as="section"
     spacing="lg"
     className={cn(
       "min-h-[70vh]",
       className
     )}
    >
     <SectionHeading
       eyebrow="Private Selection"
       title="Your Bag"
       description={
         itemCount > 0
           ? `${itemCount.toLocaleString("en-IN")} ${
               itemCount === 1
                 ? "piece has"
                 : "pieces have"
             } been reserved in your current selection.`
           : "Your selected pieces will appear here."
       }
     />

       <SplitLayout
        className="mt-10"
        primary={items}
        secondary={summary}
       />
      </Container>
    );
}
