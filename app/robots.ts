import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
 const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://sidra.com";

 return {
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/studio/private/",
        "/dashboard/"
      ]
    }
  ],
  sitemap: `${baseUrl}/sitemap.xml`,
  host: baseUrl

 };
}
