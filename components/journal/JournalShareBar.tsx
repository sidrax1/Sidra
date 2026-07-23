"use client";

import {
  Copy,
  Facebook,
  Linkedin,
  Share2,
  Twitter,
} from "lucide-react";

import { IconButton } from "@/components/ui/IconButton";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface JournalShareBarProps {
  readonly title: string;
  readonly url: string;
  readonly className?: string;
}

export function JournalShareBar({
  className,
  title,
  url,
}: JournalShareBarProps): React.JSX.Element {
  const { showToast } = useToast();

 const encodedURL =
  encodeURIComponent(url);

 const encodedTitle =
  encodeURIComponent(title);

 const openShareWindow = (
   shareURL: string
 ): void => {
   window.open(

     shareURL,
     "_blank",
     "noopener,noreferrer,width=720,height=640"
   );
 };

  return (
   <aside
     aria-label="Share article"
     className={cn(
       "flex flex-wrap items-center gap-2 rounded-full border border-border bg-card p-2shadow-[var(--shadow-card)]",
       className
     )}
   >
     <span className="ml-3 mr-2 inline-flex items-center gap-2 text-xs font-semibold uppercase
tracking-[0.15em] text-muted">
       <Share2
         aria-hidden="true"
         className="size-3.5"
       />
       Share
     </span>

   <IconButton
    label="Share on X"
    icon={<Twitter aria-hidden="true" />}
    appearance="ghost"
    size="sm"
    onClick={() =>
      openShareWindow(
        `https://twitter.com/intent/tweet?url=${encodedURL}&text=${encodedTitle}`
      )
    }
   />

   <IconButton
    label="Share on Facebook"
    icon={<Facebook aria-hidden="true" />}
    appearance="ghost"
    size="sm"
    onClick={() =>
      openShareWindow(
       `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`

           )
       }
      />

      <IconButton
       label="Share on LinkedIn"
       icon={<Linkedin aria-hidden="true" />}
       appearance="ghost"
       size="sm"
       onClick={() =>
         openShareWindow(
           `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`
         )
       }
      />

    <IconButton
     label="Copy article link"
     icon={<Copy aria-hidden="true" />}
     appearance="ghost"
     size="sm"
     onClick={() => {
       void navigator.clipboard
        .writeText(url)
        .then(() => {
          showToast({
            title: "Link copied",
            description:
              "The journal article link is ready to share.",
            variant: "success",
          });
        });
     }}
    />
   </aside>
 );
}
