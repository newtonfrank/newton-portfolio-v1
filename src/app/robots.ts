import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://newtonfrank.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /preview mirrors the homepage while it stays as a transitional
      // safety net; keep it out of the index.
      disallow: "/preview",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
