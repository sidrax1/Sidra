import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";

import { callableFunction } from "@/firebase/functions";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { SupportTicket } from "@/types/support";

interface CreateSupportTicketRequest {
  readonly subject: string;
  readonly category: SupportTicket["category"];
  readonly description: string;
  readonly priority?: SupportTicket["priority"];
  readonly orderId?: string;
  readonly studioId?: string;
  readonly attachmentPaths?: readonly string[];
}

interface CreateSupportTicketResponse {
  readonly ticket: SupportTicket;
}

interface AddSupportReplyRequest {
  readonly ticketId: string;
  readonly message: string;
  readonly attachmentPaths?: readonly string[];
}

interface AddSupportReplyResponse {
  readonly ticketId: string;
  readonly messageId: string;
}

const createSupportTicketCallable =
 callableFunction<
  CreateSupportTicketRequest,
  CreateSupportTicketResponse
 >("createSupportTicket");

const addSupportReplyCallable =
 callableFunction<
  AddSupportReplyRequest,
  AddSupportReplyResponse
 >("addSupportReply");

const firestore = getFirebaseFirestore();

export async function createSupportTicket(

  input: CreateSupportTicketRequest
): Promise<SupportTicket> {
  const result =
    await createSupportTicketCallable(
      input
    );

    return result.data.ticket;
}

export async function addSupportReply(
  input: AddSupportReplyRequest
): Promise<AddSupportReplyResponse> {
  const result =
    await addSupportReplyCallable(
      input
    );

    return result.data;
}

export async function getSupportTicket(
  ticketId: string
): Promise<SupportTicket | null> {
  const snapshot = await getDoc(
    doc(
      firestore,
      COLLECTIONS.SUPPORT_TICKETS,
      ticketId
    )
  );

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as SupportTicket;
}

export async function getUserSupportTickets(
 requesterId: string,

  maximumResults = 25
): Promise<SupportTicket[]> {
  const snapshot = await getDocs(
    query(
      collection(
        firestore,
        COLLECTIONS.SUPPORT_TICKETS
      ),
      where(
        "requesterId",
        "==",
        requesterId
      ),
      orderBy("createdAt", "desc"),
      limit(maximumResults)
    )
  );

 return snapshot.docs.map(
   (ticketDocument) =>
     ({
       id: ticketDocument.id,
       ...ticketDocument.data(),
     }) as SupportTicket
 );
}
