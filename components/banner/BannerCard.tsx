"use client";

import Image from "next/image";
import {
  Edit3,
  Eye,
  EyeOff,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,

  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";
import type { Banner } from "@/types/banner";

interface BannerCardProps {
  readonly banner: Banner;
  readonly loading?: boolean;
  readonly onEdit: (
    banner: Banner
  ) => void;
  readonly onToggleActive: (
    banner: Banner
  ) => void | Promise<void>;
  readonly onDelete: (
    banner: Banner
  ) => void | Promise<void>;
}

export function BannerCard({
  banner,
  loading = false,
  onDelete,
  onEdit,
  onToggleActive,
}: BannerCardProps): React.JSX.Element {
  return (
    <article
     className={cn(
       "overflow-hidden rounded-[var(--radius-lg)] border bg-card",
       "shadow-[var(--shadow-card)]",
       banner.active
        ? "border-[color:rgb(200_169_106_/_0.35)]"
        : "border-border opacity-75"
     )}
    >
     <div className="relative aspect-[16/6] overflow-hidden bg-[var(--color-gray-100)]">
       <Image
        src={banner.image}
        alt={banner.title}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"

      className="object-cover"
     />

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/25
to-transparent" />

     <div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center p-6
text-white">
      <Badge variant="gold">
       Priority {banner.priority}
      </Badge>

      <h3 className="mt-4 font-heading text-3xl font-medium tracking-[-0.035em]">
       {banner.title}
      </h3>

      {banner.subtitle ? (
        <p className="mt-2 line-clamp-2 text-sm text-white/70">
          {banner.subtitle}
        </p>
      ) : null}
     </div>

     <div className="absolute right-4 top-4">
      <DropdownMenu>
       <DropdownMenuTrigger>
         <IconButton
          label={`Actions for ${banner.title}`}
          icon={
            <MoreHorizontal aria-hidden="true" />
          }
          appearance="glass"
          disabled={loading}
         />
       </DropdownMenuTrigger>

       <DropdownMenuContent>
        <DropdownMenuItem
         onSelect={() =>
           onEdit(banner)
         }
        >
         <Edit3
           aria-hidden="true"

  className="size-4"
 />
 Edit Banner
</DropdownMenuItem>

<DropdownMenuItem
 onSelect={() => {
   void onToggleActive(
     banner
   );
 }}
>
 {banner.active ? (
   <EyeOff
     aria-hidden="true"
     className="size-4"
   />
 ):(
   <Eye
     aria-hidden="true"
     className="size-4"
   />
 )}
 {banner.active
   ? "Disable"
   : "Enable"}
</DropdownMenuItem>

<DropdownMenuSeparator />

<DropdownMenuItem
 destructive
 onSelect={() => {
   void onDelete(
     banner
   );
 }}
>
 <Trash2
   aria-hidden="true"
   className="size-4"
 />
 Delete Banner
</DropdownMenuItem>

         </DropdownMenuContent>
       </DropdownMenu>
     </div>
    </div>
   </article>
 );
}
