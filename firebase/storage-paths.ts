import { assertValidDocumentId } from "@/firebase/identifiers";

function sanitizePathSegment(value: string): string {
 const normalized = value
  .trim()
  .replace(/\\/g, "/")
  .replace(/^\/+|\/+$/g, "");

    if (
      !normalized ||
      normalized.includes("..") ||
      normalized.includes("//")
    ){
      throw new Error("Invalid Firebase Storage path segment.");
    }

    return normalized;
}

function joinStoragePath(
  ...segments: readonly string[]
): string {
  return segments
    .map(sanitizePathSegment)
    .join("/");
}

export const storagePaths = {
 userProfile(userId: string, fileName: string): string {
  return joinStoragePath(

    "users",
    assertValidDocumentId(userId),
    "profile",
    fileName
  );
},

studioLogo(studioId: string, fileName: string): string {
  return joinStoragePath(
    "studios",
    assertValidDocumentId(studioId),
    "logo",
    fileName
  );
},

studioBanner(studioId: string, fileName: string): string {
  return joinStoragePath(
    "studios",
    assertValidDocumentId(studioId),
    "banner",
    fileName
  );
},

studioGallery(studioId: string, fileName: string): string {
  return joinStoragePath(
    "studios",
    assertValidDocumentId(studioId),
    "gallery",
    fileName
  );
},

productImage(
  studioId: string,
  productId: string,
  fileName: string
): string {
  return joinStoragePath(
    "studios",
    assertValidDocumentId(studioId),
    "products",
    assertValidDocumentId(productId),

    fileName
  );
},

customOrderAttachment(
  userId: string,
  customOrderId: string,
  fileName: string
): string {
  return joinStoragePath(
    "custom-orders",
    assertValidDocumentId(userId),
    assertValidDocumentId(customOrderId),
    fileName
  );
},

reviewAttachment(
  userId: string,
  reviewId: string,
  fileName: string
): string {
  return joinStoragePath(
    "reviews",
    assertValidDocumentId(userId),
    assertValidDocumentId(reviewId),
    fileName
  );
},

temporaryUpload(userId: string, fileName: string): string {
  return joinStoragePath(
    "temp",
    assertValidDocumentId(userId),
    fileName
  );
},

cmsAsset(section: string, fileName: string): string {
 return joinStoragePath(
   "cms",
   section,
   fileName
 );

 },

  mediaLibrary(fileName: string): string {
    return joinStoragePath(
      "media-library",
      fileName
    );
  },
} as const;
