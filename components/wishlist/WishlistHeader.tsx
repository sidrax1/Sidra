import {
  Heart,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";

import {
  SectionHeading,
} from "@/components/ui/SectionHeading";

interface WishlistHeaderProps {
  readonly itemCount: number;
}

export function WishlistHeader({
  itemCount,
}: WishlistHeaderProps): React.JSX.Element {
  return (
    <SectionHeading
     eyebrow="Private Collection"
     title="Your Wishlist"
     description={
       <span>
         A considered selection of{" "}
         <strong className="font-semibold text-foreground">
          {itemCount.toLocaleString(
            "en-IN"
          )}{" "}
          {itemCount === 1
            ? "piece"
            : "pieces"}
         </strong>{" "}
         saved for later.
       </span>
     }
     action={
       <Badge
         variant="gold"
         className="gap-2 px-4 py-2"
       >
         <Heart
          aria-hidden={true}

           className="size-4 fill-current"
         />
         {itemCount.toLocaleString(
           "en-IN"
         )}{" "}
         Saved
        </Badge>
    }
   />
 );
}
