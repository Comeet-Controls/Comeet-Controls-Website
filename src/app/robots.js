// src/app/robots.js — Next.js Metadata API for robots.txt
// Tells search engines what to crawl and what to ignore

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.comeetindia.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
