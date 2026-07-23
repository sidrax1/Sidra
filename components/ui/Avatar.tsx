import Image from "next/image";

import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/string";

interface AvatarProps {
  readonly name: string;
  readonly src?: string | null;
  readonly size?: "sm" | "md" | "lg" | "xl";
  readonly className?: string;
  readonly priority?: boolean;
}

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl",
} as const;

const pixelSizes = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
} as const;

export function Avatar({
  className,
  name,
  priority = false,
  size = "md",
  src,
}: AvatarProps): React.JSX.Element {
  const dimensions = pixelSizes[size];

 return (
   <span
    className={cn(
      "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full borderborder-[color:rgb(200_169_106_/_0.3)] bg-[var(--color-gold-100)] font-semiboldtext-[var(--color-gold-600)]",

      sizeClasses[size],
      className
    )}
    aria-label={name}
    title={name}
   >
    {src ? (
      <Image
        src={src}
        alt={name}
        width={dimensions}
        height={dimensions}
        priority={priority}
        className="size-full object-cover"
      />
    ):(
      getInitials(name)
    )}
   </span>
 );
}
