import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";
import { callableFunction } from "@/firebase/functions";
import type {
  Conversation,
  Message,
} from "@/types/message";

interface SendMessageRequest {
  readonly conversationId: string;

    readonly text: string;
    readonly attachmentPaths?: readonly string[];
    readonly idempotencyKey: string;
}

interface SendMessageResponse {
  readonly message: Message;
}

interface CreateConversationRequest {
  readonly participantIds: readonly string[];
  readonly contextType: Conversation["contextType"];
  readonly contextId: string;
}

interface CreateConversationResponse {
  readonly conversation: Conversation;
}

const sendMessageCallable = callableFunction<
 SendMessageRequest,
 SendMessageResponse
>("sendMessage");

const createConversationCallable = callableFunction<
 CreateConversationRequest,
 CreateConversationResponse
>("createConversation");

const firestore = getFirebaseFirestore();

export async function sendMessage(
  input: SendMessageRequest
): Promise<Message> {
  const result = await sendMessageCallable(input);

    return result.data.message;
}

export async function createConversation(
  input: CreateConversationRequest
): Promise<Conversation> {
  const result = await createConversationCallable(input);

    return result.data.conversation;
}

export async function getUserConversations(
  userId: string,
  maximumResults = 30
): Promise<Conversation[]> {
  const snapshot = await getDocs(
    query(
      collection(
        firestore,
        COLLECTIONS.CONVERSATIONS
      ),
      where(
        "participantIds",
        "array-contains",
        userId
      ),
      orderBy("lastMessageAt", "desc"),
      limit(maximumResults)
    )
  );

    return snapshot.docs.map(
      (documentSnapshot) =>
       ({
         id: documentSnapshot.id,
         ...documentSnapshot.data(),
       }) as Conversation
    );
}

export async function getConversationMessages(
  conversationId: string,
  maximumResults = 50
): Promise<Message[]> {
  const snapshot = await getDocs(
   query(
    collection(
      firestore,
      COLLECTIONS.MESSAGES
    ),
    where(
      "conversationId",

         "==",
         conversationId
       ),
       orderBy("createdAt", "desc"),
       limit(maximumResults)
   )
 );

 return snapshot.docs
  .map(
    (documentSnapshot) =>
     ({
       id: documentSnapshot.id,
       ...documentSnapshot.data(),
     }) as Message
  )
  .reverse();
}
