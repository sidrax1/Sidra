"use client";

import {
  MessageCircle,
} from "lucide-react";

import {
  Avatar,
} from "@/components/ui/Avatar";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  Conversation,
} from "@/types/message";

interface ConversationCardProps {
  readonly conversation: Conversation;
  readonly title: string;
  readonly avatarURL?: string | null;

    readonly unreadCount?: number;
    readonly selected?: boolean;
    readonly onSelect: (
      conversation: Conversation
    ) => void;
}

export function ConversationCard({
  avatarURL,
  conversation,
  onSelect,
  selected = false,
  title,
  unreadCount = 0,
}: ConversationCardProps): React.JSX.Element {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() =>
        onSelect(conversation)
      }
      className={cn(
        "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] gap-3 rounded-[var(--radius-md)] borderp-4 text-left",
        "transition-[border-color,background-color,box-shadow]",
        selected
          ? "border-[var(--color-gold-500)] bg-[color:rgb(200_169_106_/_0.08)]shadow-[var(--shadow-gold-glow)]"
          : "border-transparent hover:border-border hover:bg-card"
      )}
    >
      <Avatar
        name={title}
        src={avatarURL}
        size="md"
      />

      <span className="min-w-0">
       <span className="flex items-center gap-2">
        <span className="truncate font-medium text-foreground">
         {title}
        </span>

        {unreadCount > 0 ? (
          <Badge variant="gold">
            {unreadCount}
          </Badge>
        ) : null}
       </span>

       <span className="mt-1 block truncate text-sm text-muted">
        {conversation.lastMessageText ||
         "Start the conversation"}
       </span>

       <span className="mt-2 block text-xs text-muted">
        {conversation.lastMessageAt
          ? formatDateTime(
              conversation.lastMessageAt
            )
          : "No messages yet"}
       </span>
      </span>

    <MessageCircle
     aria-hidden={true}
     className="mt-1 size-4 text-[var(--color-gold-600)]"
    />
   </button>
 );
}
