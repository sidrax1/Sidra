import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
 const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://sidra.com";

 return {
  id: "/",
  name: "Sidra",
  short_name: "Sidra",
  description:
    "India's Premium Luxury Resin Marketplace.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  display_override: [
    "standalone",
    "minimal-ui"
  ],
  orientation: "portrait",
  background_color: "#F7F4EF",
  theme_color: "#C8A96A",
  lang: "en-IN",

  categories: [
    "shopping",
    "lifestyle",
    "business"
  ],

  icons: [

          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
      ]
    };
}
