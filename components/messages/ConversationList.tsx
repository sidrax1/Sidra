import {
  ConversationCard,
} from "@/components/messages/ConversationCard";
import {
  EmptyState,
} from "@/components/ui/EmptyState";
import type {
  Conversation,
} from "@/types/message";

export interface ConversationListItem {
  readonly conversation: Conversation;
  readonly title: string;
  readonly avatarURL?: string | null;
  readonly unreadCount?: number;
}

interface ConversationListProps {
  readonly items: readonly ConversationListItem[];
  readonly selectedConversationId?: string | null;
  readonly onSelect: (
    conversation: Conversation
  ) => void;
}

export function ConversationList({
  items,
  onSelect,
  selectedConversationId,
}: ConversationListProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No conversations"
        description="Your customer, seller and support conversations will appear here."
      />
    );
  }

 return (
  <div className="grid gap-2">
    {items.map((item) => (
      <ConversationCard
       key={
         item.conversation.id
       }
       conversation={
         item.conversation
       }
       title={item.title}
       avatarURL={
         item.avatarURL
       }

        unreadCount={
          item.unreadCount
        }
        selected={
          item.conversation.id ===
          selectedConversationId
        }
        onSelect={onSelect}
      />
    ))}
   </div>
 );
}
