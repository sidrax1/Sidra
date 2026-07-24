import {
  CheckCheck,
} from "lucide-react";

import {
  Avatar,
} from "@/components/ui/Avatar";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  Message,
} from "@/types/message";

interface MessageBubbleProps {
  readonly message: Message;
  readonly currentUserId: string;
  readonly senderName: string;
  readonly senderPhotoURL?: string | null;
}

export function MessageBubble({
  currentUserId,
  message,
  senderName,
  senderPhotoURL,
}: MessageBubbleProps): React.JSX.Element {
  const own =
   message.senderId ===
   currentUserId;

 return (
  <article
    className={cn(
      "flex max-w-[86%] gap-3",
      own
        ? "ml-auto flex-row-reverse"
        : "mr-auto"
    )}
  >
    <Avatar
      name={senderName}
      src={senderPhotoURL}
      size="sm"
    />

   <div
    className={cn(
      "rounded-[var(--radius-lg)] border px-4 py-3",
      own
        ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-black-900)]"
        : "border-border bg-card text-foreground shadow-[var(--shadow-card)]"
    )}
   >
    <p className="whitespace-pre-wrap text-sm leading-6">
      {message.text}
    </p>

     {message.attachmentURLs &&
     message.attachmentURLs.length >
      0?(
      <div className="mt-3 grid gap-2">
       {message.attachmentURLs.map(
        (
          attachmentURL,

        index
      ) => (
        <a
          key={attachmentURL}
          href={
            attachmentURL
          }
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium underline underline-offset-4"
        >
          Attachment{" "}
          {index + 1}
        </a>
      )
    )}
  </div>
) : null}

<div
 className={cn(
   "mt-2 flex items-center justify-end gap-2 text-[10px]",
   own
     ? "text-[var(--color-black-900)]/60"
     : "text-muted"
 )}
>
 <time>
   {formatDateTime(
     message.createdAt
   )}
 </time>

 {own ? (
  <CheckCheck
   aria-label={
     message.readBy.length > 0
      ? "Read"
      : "Delivered"
   }
   className={cn(
     "size-3.5",
     message.readBy.length > 0 &&
      "text-[var(--color-success)]"

           )}
         />
       ) : null}
     </div>
    </div>
   </article>
 );
}
