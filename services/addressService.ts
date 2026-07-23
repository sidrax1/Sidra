import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { Address } from "@/types/address";

const firestore = getFirebaseFirestore();

function userAddressesCollection(
 userId: string
){
 return collection(

      firestore,
      COLLECTIONS.USERS,
      userId,
      "addresses"
    );
}

function addressReference(
  userId: string,
  addressId: string
){
  return doc(
    firestore,
    COLLECTIONS.USERS,
    userId,
    "addresses",
    addressId
  );
}

export async function getUserAddresses(
  userId: string
): Promise<Address[]> {
  const snapshot = await getDocs(
    query(
      userAddressesCollection(userId),
      orderBy("createdAt", "desc")
    )
  );

    return snapshot.docs.map(
      (addressDocument) =>
       ({
         id: addressDocument.id,
         ...addressDocument.data(),
       }) as Address
    );
}

export async function createAddress(
 userId: string,
 addressId: string,
 address: Omit<
  Address,

   | "id"
   | "createdAt"
   | "updatedAt"
  >
): Promise<void> {
  const batch =
   writeBatch(firestore);

 if (
   address.defaultShipping ||
   address.defaultBilling
 ){
   const existingAddresses =
      await getDocs(
        userAddressesCollection(
          userId
        )
      );

  for (
   const existingAddress
   of existingAddresses.docs
  ){
   const updates: Record<
     string,
     unknown
   > = {};

    if (address.defaultShipping) {
      updates.defaultShipping =
        false;
    }

    if (address.defaultBilling) {
      updates.defaultBilling =
        false;
    }

    batch.update(
     existingAddress.ref,
     {
       ...updates,
       updatedAt:
         serverTimestamp(),

              }
            );
        }
    }

    batch.set(
      addressReference(
        userId,
        addressId
      ),
      {
        ...address,
        createdAt:
          serverTimestamp(),
        updatedAt:
          serverTimestamp(),
      }
    );

    await batch.commit();
}

export async function updateAddress(
  userId: string,
  addressId: string,
  address: Partial<Address>
): Promise<void> {
  await updateDoc(
    addressReference(
      userId,
      addressId
    ),
    {
      ...address,
      updatedAt:
        serverTimestamp(),
    }
  );
}

export async function deleteAddress(
  userId: string,
  addressId: string
): Promise<void> {

 await deleteDoc(
   addressReference(
     userId,
     addressId
   )
 );
}
