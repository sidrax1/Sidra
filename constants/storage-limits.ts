/**
 * SIDRA Storage Limits
 * Production Configuration
 */

export const STORAGE_LIMITS = {
 MAX_IMAGE_SIZE_MB: 10,

 MAX_VIDEO_SIZE_MB: 150,

 MAX_DOCUMENT_SIZE_MB: 25,

 MAX_PROFILE_IMAGE_MB: 5,

 MAX_LOGO_MB: 5,

 MAX_BANNER_MB: 15,

 MAX_PRODUCT_IMAGES: 10,

 MAX_PRODUCT_VIDEOS: 2,

 MAX_COLLECTION_IMAGES: 1,

 MAX_REVIEW_IMAGES: 5,

 MAX_CUSTOM_ORDER_IMAGES: 15,

 ALLOWED_IMAGE_TYPES: [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"

 ],

 ALLOWED_VIDEO_TYPES: [
   "video/mp4",
   "video/webm",
   "video/quicktime"
 ],

  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf"
  ]
} as const;
