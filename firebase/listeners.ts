import {
  onSnapshot,
  type DocumentData,
  type DocumentReference,
  type FirestoreError,
  type Query,
  type Unsubscribe,
} from "firebase/firestore";

export interface ListenerHandlers<T> {
  onData: (data: T) => void;
  onError?: (error: FirestoreError) => void;
}

export function subscribeToDocument<T extends DocumentData>(
 reference: DocumentReference<T>,
 handlers: ListenerHandlers<T | null>

): Unsubscribe {
  return onSnapshot(
    reference,
    {
      includeMetadataChanges: false,
    },
    (snapshot) => {
      handlers.onData(
        snapshot.exists()
         ? snapshot.data()
         : null
      );
    },
    (error) => {
      handlers.onError?.(error);
    }
  );
}

export function subscribeToQuery<T extends DocumentData>(
  firestoreQuery: Query<T>,
  handlers: ListenerHandlers<T[]>
): Unsubscribe {
  return onSnapshot(
    firestoreQuery,
    {
      includeMetadataChanges: false,
    },
    (snapshot) => {
      handlers.onData(
        snapshot.docs.map((document) =>
          document.data()
        )
      );
    },
    (error) => {
      handlers.onError?.(error);
    }
  );
}

export function createManagedSubscription(
  subscribe: () => Unsubscribe
): {

 start: () => void;
 stop: () => void;
 restart: () => void;
 isActive: () => boolean;
}{
 let unsubscribe: Unsubscribe | null = null;

 const start = (): void => {
  if (unsubscribe) {
    return;
  }

   unsubscribe = subscribe();
 };

 const stop = (): void => {
   unsubscribe?.();
   unsubscribe = null;
 };

 const restart = (): void => {
   stop();
   start();
 };

 const isActive = (): boolean =>
  unsubscribe !== null;

 return {
   start,
   stop,
   restart,
   isActive,
 };
}
