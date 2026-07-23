import {
  Headphones,
  UserRound,
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

export interface SupportMessage {
  readonly id: string;
  readonly senderId: string;
  readonly senderName: string;
  readonly senderPhotoURL?: string | null;
  readonly senderRole:
   | "customer"
   | "support"
   | "admin";
  readonly message: string;
  readonly attachmentURLs?: readonly string[];
  readonly createdAt: string;
}

interface SupportMessageBubbleProps {
  readonly message: SupportMessage;
  readonly currentUserId: string;
}

export function SupportMessageBubble({
  currentUserId,
  message,
}: SupportMessageBubbleProps): React.JSX.Element {
  const own =
   message.senderId ===
   currentUserId;

 const staff =
  message.senderRole ===
   "support" ||
  message.senderRole ===
   "admin";

 return (
  <article
    className={cn(
      "flex max-w-[88%] gap-3",
      own
        ? "ml-auto flex-row-reverse"
        : "mr-auto"
    )}
  >
    <Avatar
      name={message.senderName}
      src={
        message.senderPhotoURL
      }
      size="sm"
    />

   <div
    className={cn(
      "rounded-[var(--radius-lg)] border px-4 py-3",
      own
        ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-black-900)]"
        : "border-border bg-background text-foreground"
    )}

>
 <div className="flex flex-wrap items-center gap-2">
  <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
   {staff ? (
     <Headphones
      aria-hidden={true}
      className="size-3.5"
     />
   ):(
     <UserRound
      aria-hidden={true}
      className="size-3.5"
     />
   )}
   {message.senderName}
  </span>

  <time className="text-[11px] opacity-65">
   {formatDateTime(
     message.createdAt
   )}
  </time>
 </div>

 <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
  {message.message}
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
    </div>
   </article>
 );
}
