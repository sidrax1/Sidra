import {
  doc,
  getDoc,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { callableFunction } from "@/firebase/functions";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type {
  PlatformSettings,
  StoreCustomizationOptions,
} from "@/types/settings";

interface UpdatePlatformSettingsRequest {
  readonly settings: Partial<
   Omit<
     PlatformSettings,
     | "id"
     | "createdAt"
     | "updatedAt"
   >
  >;
}

interface UpdatePlatformSettingsResponse {
  readonly settings: PlatformSettings;
}

const updatePlatformSettingsCallable =
 callableFunction<
  UpdatePlatformSettingsRequest,
  UpdatePlatformSettingsResponse
 >("updatePlatformSettings");

export async function getPlatformSettings(): Promise<PlatformSettings | null> {
 const snapshot = await getDoc(
   doc(
     getFirebaseFirestore(),
     COLLECTIONS.SETTINGS,
     "platform"
   )
 );

 return snapshot.exists()
  ? ({
      id: snapshot.id,
      ...snapshot.data(),
    } as PlatformSettings)
  : null;

}

export async function getStoreCustomizationOptions(): Promise<StoreCustomizationOptions |
null> {
 const snapshot = await getDoc(
   doc(
     getFirebaseFirestore(),
     COLLECTIONS.SETTINGS,
     "storeCustomizationOptions"
   )
 );

    return snapshot.exists()
     ? ({
         id: snapshot.id,
         ...snapshot.data(),
       } as StoreCustomizationOptions)
     : null;
}

export async function updatePlatformSettings(
  settings: UpdatePlatformSettingsRequest["settings"]
): Promise<PlatformSettings> {
  const result =
   await updatePlatformSettingsCallable(
     {
       settings,
     }
   );

    return result.data.settings;
}
