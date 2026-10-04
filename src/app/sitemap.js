// src/app/sitemap.js — Next.js Metadata API for sitemap.xml
// Helps Google discover and index all public pages of the site

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.comeetindia.com";
  const now = new Date();

  const routes = [
    { url: "/",         priority: 1.0,  changeFrequency: "weekly"  },
    { url: "/services", priority: 0.9,  changeFrequency: "weekly"  },
    { url: "/projects", priority: 0.9,  changeFrequency: "weekly"  },
    { url: "/about",    priority: 0.8,  changeFrequency: "monthly" },
    { url: "/contact",  priority: 0.8,  changeFrequency: "monthly" },
    { url: "/quality",  priority: 0.6,  changeFrequency: "monthly" },
  ];

  return routes.map(({ url, priority, changeFrequency }) => ({
    url: `${baseUrl}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
