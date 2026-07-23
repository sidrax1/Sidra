import {
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type {
  DisputeMessage,
} from "@/types/dispute";

interface DisputeMessageThreadProps {
  readonly messages: readonly DisputeMessage[];
  readonly currentUserId: string;
  readonly includeInternal?: boolean;
  readonly className?: string;
}

export function DisputeMessageThread({
  className,
  currentUserId,
  includeInternal = false,
  messages,
}: DisputeMessageThreadProps): React.JSX.Element {
  const visibleMessages = messages
    .filter(
      (message) =>
        includeInternal ||
        !message.internal
    )
    .sort((first, second) =>
      first.createdAt.localeCompare(
        second.createdAt
      )
    );

  if (visibleMessages.length === 0) {
    return (
      <EmptyState
        title="No dispute messages"
        description="Participant communication and evidence requests will appear here."
      />
    );
  }

  return (
    <section
      aria-label="Dispute conversation"
      className={cn(
        "grid min-h-[420px] content-end gap-5 rounded-[var(--radius-xl)]",
        "border border-border bg-background p-5",
        className
      )}
    >
      {visibleMessages.map((message) => {
        const own =
          message.senderId ===
          currentUserId;

        const staff =
          message.senderRole === "support" ||
          message.senderRole === "admin" ||
          message.senderRole === "compliance";

        return (
          <article
            key={message.id}
            className={cn(
              "flex max-w-[88%] gap-3",
              own
                ? "ml-auto flex-row-reverse"
                : "mr-auto"
            )}
          >
            <Avatar
              name={message.senderName}
              src={message.senderPhotoURL}
              size="sm"
            />

            <div
              className={cn(
                "rounded-[var(--radius-lg)] border px-4 py-3",
                message.internal
                  ? "border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.06)]"
                  : own
                    ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-black-900)]"
                    : "border-border bg-card text-foreground shadow-[var(--shadow-card)]"
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">
                  {message.senderName}
                </span>

                {staff ? (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em]">
                    <ShieldCheck
                      aria-hidden="true"
                      className="size-3"
                    />
                    {message.senderRole}
                  </span>
                ) : null}

                {message.internal ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-error)]">
                    <LockKeyhole
                      aria-hidden="true"
                      className="size-3"
                    />
                    Internal
                  </span>
                ) : null}
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                {message.message}
              </p>

              {message.attachmentURLs.length > 0 ? (
                <div className="mt-3 grid gap-2">
                  {message.attachmentURLs.map(
                    (
                      attachmentURL,
                      index
                    ) => (
                      <a
                        key={attachmentURL}
                        href={attachmentURL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium underline underline-offset-4"
                      >
                        Attachment {index + 1}
                      </a>
                    )
                  )}
                </div>
              ) : null}

              <time className="mt-3 block text-[10px] opacity-65">
                {formatDateTime(
                  message.createdAt
                )}
              </time>
            </div>
          </article>
        );
      })}
    </section>
  );
}
