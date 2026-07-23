import type {
  App} from "firebase-admin/app";
import {
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";

import { getFirestore } from "firebase-admin/firestore";

import { getStorage } from "firebase-admin/storage";

let adminApp: App;

export function getFirebaseAdmin(): App {
 if (getApps().length) {
   adminApp = getApp();
 } else {
   adminApp = initializeApp({
     credential: cert({
      projectId:
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,

       clientEmail:
        process.env.FIREBASE_CLIENT_EMAIL,

        privateKey:
          process.env.FIREBASE_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n"
          ),
      }),

          storageBucket:
            process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
    }

    return adminApp;
}

export const adminAuth = getAuth(getFirebaseAdmin());

export const adminFirestore =
 getFirestore(getFirebaseAdmin());

export const adminStorage =
  getStorage(getFirebaseAdmin());
