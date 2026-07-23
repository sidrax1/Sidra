import {
  doc,
  getDoc,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";

import { getFirebaseFirestore } from "@/firebase/firestore";

export interface CanvasFramePreset {
  readonly id: string;
  readonly aspectRatio: number;
  readonly cropAnchor:
   | "center"
   | "top"
   | "bottom"
   | "left"
   | "right";
  readonly borderStyle:
   | "none"
   | "fineGold"
   | "floatingIvory"
   | "darkGallery";
  readonly vignetteStrength: number;
  readonly contrast: number;
  readonly saturation: number;
  readonly grain: number;
  readonly shadowBlur: number;
  readonly shadowOpacity: number;
}

export interface CanvasEngineSettings {
  readonly defaultPreset: CanvasFramePreset;
  readonly categoryPresets: Readonly<
   Record<string, CanvasFramePreset>
  >;
  readonly updatedAt?: string;
}

const SETTINGS_DOCUMENT_ID =
 "canvasEngineFrames";

export async function getCanvasEngineSettings(): Promise<CanvasEngineSettings> {
 const snapshot = await getDoc(
   doc(
     getFirebaseFirestore(),
     COLLECTIONS.SETTINGS,
     SETTINGS_DOCUMENT_ID
   )
 );

    if (!snapshot.exists()) {
      throw new Error(
        "Canvas Engine configuration is unavailable."
      );
    }

    return snapshot.data() as CanvasEngineSettings;
}

export function resolveCanvasFramePreset(
  settings: CanvasEngineSettings,
  categorySlug: string
): CanvasFramePreset {
  const normalizedSlug = categorySlug
   .trim()
   .toLowerCase();

    return (
      settings.categoryPresets[normalizedSlug] ??
      settings.defaultPreset
    );
}
