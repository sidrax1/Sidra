import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { callableFunction } from "@/firebase/functions";
import { getFirebaseFirestore } from "@/firebase/firestore";
import {
  deleteUploadedFile,
  uploadFile,
  type UploadFileOptions,
  type UploadedFile,
} from "@/firebase/uploads";
import type { MediaAsset } from "@/types/media";

interface RegisterMediaRequest {
  readonly fileName: string;
  readonly originalFileName: string;
  readonly storagePath: string;
  readonly downloadURL: string;

    readonly mimeType: string;
    readonly sizeBytes: number;
    readonly width?: number;
    readonly height?: number;
    readonly durationSeconds?: number;
    readonly altText?: string;
    readonly studioId?: string;
}

interface RegisterMediaResponse {
  readonly media: MediaAsset;
}

interface DeleteMediaRequest {
  readonly mediaId: string;
}

interface DeleteMediaResponse {
  readonly deleted: boolean;
  readonly storagePath: string;
}

const registerMediaCallable =
 callableFunction<
  RegisterMediaRequest,
  RegisterMediaResponse
 >("registerMediaAsset");

const deleteMediaCallable =
 callableFunction<
  DeleteMediaRequest,
  DeleteMediaResponse
 >("deleteMediaAsset");

const firestore = getFirebaseFirestore();

export async function uploadAndRegisterMedia(
 uploadOptions: UploadFileOptions,
 registration: Omit<
  RegisterMediaRequest,
  | "storagePath"
  | "downloadURL"
  | "sizeBytes"
  | "mimeType"

  >
): Promise<MediaAsset> {
  const uploadedFile: UploadedFile =
   await uploadFile(uploadOptions);

    try {
      const result =
       await registerMediaCallable({
         ...registration,
         storagePath:
           uploadedFile.path,
         downloadURL:
           uploadedFile.downloadURL,
         sizeBytes:
           uploadedFile.size,
         mimeType:
           uploadedFile.contentType ??
           "application/octet-stream",
       });

      return result.data.media;
    } catch (error) {
      await deleteUploadedFile(
        uploadedFile.path
      ).catch(() => undefined);

        throw error;
    }
}

export async function deleteMediaAsset(
  mediaId: string
): Promise<boolean> {
  const result =
   await deleteMediaCallable({
     mediaId,
   });

    return result.data.deleted;
}

export async function getStudioMedia(
 studioId: string,
 maximumResults = 50

): Promise<MediaAsset[]> {
  const snapshot = await getDocs(
    query(
      collection(
        firestore,
        COLLECTIONS.MEDIA
      ),
      where("studioId", "==", studioId),
      orderBy("createdAt", "desc"),
      limit(maximumResults)
    )
  );

 return snapshot.docs.map(
   (mediaDocument) =>
    ({
      id: mediaDocument.id,
      ...mediaDocument.data(),
    }) as MediaAsset
 );
}
