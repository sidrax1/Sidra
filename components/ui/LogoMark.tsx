import {
  cn,
} from "@/lib/utils";

interface LogoMarkProps {
  readonly size?: "sm" | "md" | "lg";
  readonly showWordmark?: boolean;
  readonly inverted?: boolean;
  readonly className?: string;
}

const sizeClasses = {
 sm: {
   mark: "size-8",
   wordmark: "text-2xl",
 },
 md: {
   mark: "size-10",
   wordmark: "text-3xl",
 },
 lg: {

    mark: "size-14",
    wordmark: "text-5xl",
  },
} as const;

export function LogoMark({
  className,
  inverted = false,
  showWordmark = true,
  size = "md",
}: LogoMarkProps): React.JSX.Element {
  const classes =
    sizeClasses[size];

 return (
  <span
    className={cn(
      "inline-flex items-center gap-3",
      inverted
        ? "text-[var(--color-ivory-100)]"
        : "text-foreground",
      className
    )}
  >
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Sidra"
      className={cn(
        "shrink-0",
        classes.mark
      )}
    >
      <defs>
        <linearGradient
          id="sidra-gold-gradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#EFE3CB"

        />
        <stop
          offset="50%"
          stopColor="#C8A96A"
        />
        <stop
          offset="100%"
          stopColor="#B08D4F"
        />
       </linearGradient>
      </defs>

     <path
      d="M24 4C13.5 4 6 10.2 6 18.5c0 6.4 4.2 10.3 12.8 12.3l8.7 2c4.4 1 6.5 2.6 6.5 5.1 0
3.4-3.9 5.8-9.6 5.8-6.1 0-10.8-2.5-14.3-7.4L5 40.2C9.6 47 16.1 50 24.3 50 35 50 42 44.4 42
36c0-6.7-4.3-10.5-13-12.5l-8.7-2c-4.3-1-6.3-2.4-6.3-4.8 0-3.2 3.8-5.5 9.2-5.5 5.2 0 9.4 2.1 12.5
6.4l5-3.6C36.6 7.3 31 4 24 4Z"
      transform="scale(.83)"
      transform-origin="center"
      fill="url(#sidra-gold-gradient)"
     />
    </svg>

    {showWordmark ? (
      <span
        className={cn(
          "font-heading font-semibold tracking-[-0.045em]",
          classes.wordmark
        )}
      >
        Sidra
      </span>
    ) : null}
   </span>
 );
}
