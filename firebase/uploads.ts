import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadMetadata,
  type UploadTask,
  type UploadTaskSnapshot,
} from "firebase/storage";

import { getFirebaseStorage } from "@/firebase/storage";

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  state: UploadTaskSnapshot["state"];
}

export interface UploadFileOptions {
  path: string;
  file: Blob | Uint8Array | ArrayBuffer;
  metadata?: UploadMetadata;
  onProgress?: (progress: UploadProgress) => void;
  signal?: AbortSignal;
}

export interface UploadedFile {

    path: string;
    downloadURL: string;
    contentType: string | null;
    size: number;
}

function createUploadTask(
  options: UploadFileOptions
): UploadTask {
  const storageReference = ref(
    getFirebaseStorage(),
    options.path
  );

    return uploadBytesResumable(
      storageReference,
      options.file,
      options.metadata
    );
}

export async function uploadFile(
  options: UploadFileOptions
): Promise<UploadedFile> {
  const task = createUploadTask(options);

    return new Promise<UploadedFile>((resolve, reject) => {
     const abortHandler = (): void => {
       task.cancel();
       reject(new DOMException("Upload cancelled.", "AbortError"));
     };

     if (options.signal?.aborted) {
       abortHandler();
       return;
     }

     options.signal?.addEventListener(
       "abort",
       abortHandler,
       {
         once: true,
       }
     );

task.on(
 "state_changed",
 (snapshot) => {
   const percentage =
    snapshot.totalBytes > 0
     ? (snapshot.bytesTransferred /
        snapshot.totalBytes) *
       100
     : 0;

   options.onProgress?.({
     bytesTransferred: snapshot.bytesTransferred,
     totalBytes: snapshot.totalBytes,
     percentage,
     state: snapshot.state,
   });
 },
 (error) => {
   options.signal?.removeEventListener(
     "abort",
     abortHandler
   );

   reject(error);
 },
 async () => {
   try {
     options.signal?.removeEventListener(
       "abort",
       abortHandler
     );

   const downloadURL = await getDownloadURL(
     task.snapshot.ref
   );

   resolve({
     path: task.snapshot.ref.fullPath,
     downloadURL,
     contentType:
       task.snapshot.metadata.contentType ?? null,
     size: task.snapshot.totalBytes,
   });

            } catch (error) {
              reject(error);
            }
        }
      );
    });
}

export async function deleteUploadedFile(
  path: string
): Promise<void> {
  const storageReference = ref(
    getFirebaseStorage(),
    path
  );

    await deleteObject(storageReference);
}

export async function getUploadedFileURL(
  path: string
): Promise<string> {
  const storageReference = ref(
    getFirebaseStorage(),
    path
  );

    return getDownloadURL(storageReference);
}
