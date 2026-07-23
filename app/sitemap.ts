import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
 const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://sidra.com";

 return [
  {
    url: baseUrl,
    changeFrequency: "daily",
    priority: 1,
    lastModified: new Date()
  },
  {
    url: `${baseUrl}/discover`,
    changeFrequency: "daily",
    priority: 0.9,
    lastModified: new Date()
  },
  {
    url: `${baseUrl}/studios`,
    changeFrequency: "daily",
    priority: 0.9,
    lastModified: new Date()
  },
  {
    url: `${baseUrl}/about`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: new Date()

   },
   {
     url: `${baseUrl}/contact`,
     changeFrequency: "monthly",
     priority: 0.6,
     lastModified: new Date()
   }
 ];
}
