import type { BaseEntity } from "@/types/common";

export interface ConversationParticipant {
  readonly userId: string;
  readonly role: string;
  readonly joinedAt: string;
  readonly lastReadAt?: string;
}

export interface Conversation extends BaseEntity {
  readonly participantIds: readonly string[];
  readonly participants: readonly ConversationParticipant[];
  readonly contextType: "order" | "customOrder" | "support";
  readonly contextId: string;
  readonly lastMessageText?: string;
  readonly lastMessageAt?: string;
  readonly closed: boolean;
}

export interface Message extends BaseEntity {
 readonly conversationId: string;
 readonly senderId: string;
 readonly text: string;

 readonly attachmentURLs: readonly string[];
 readonly readBy: readonly string[];
 readonly editedAt?: string;
 readonly deletedAt?: string;
}
