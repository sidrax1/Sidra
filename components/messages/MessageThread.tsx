import {
  useMemo,
} from "react";

import {
  MessageBubble,
} from "@/components/messages/MessageBubble";
import type {
  Message,
} from "@/types/message";

interface MessageSenderProfile {
  readonly name: string;
  readonly photoURL?: string | null;
}

interface MessageThreadProps {
  readonly messages: readonly Message[];
  readonly currentUserId: string;
  readonly senderProfiles: Readonly<
   Record<
     string,
     MessageSenderProfile
   >
  >;
}

export function MessageThread({
 currentUserId,

  messages,
  senderProfiles,
}: MessageThreadProps): React.JSX.Element {
  const orderedMessages =
   useMemo(
     () =>
       [...messages].sort(
         (
           firstMessage,
           secondMessage
         ) =>
           firstMessage.createdAt.localeCompare(
             secondMessage.createdAt
           )
       ),
     [messages]
   );

 return (
  <section
    aria-label="Conversation messages"
    className="grid min-h-[420px] content-end gap-4 overflow-y-auto p-5"
  >
    {orderedMessages.map(
     (message) => {
       const sender =
        senderProfiles[
          message.senderId
        ];

      return (
       <MessageBubble
         key={message.id}
         message={message}
         currentUserId={
           currentUserId
         }
         senderName={
           sender?.name ??
           "Sidra Member"
         }
         senderPhotoURL={
           sender?.photoURL
         }

        />
      );
      }
    )}
   </section>
 );
}
