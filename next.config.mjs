/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["nodemailer", "@neondatabase/serverless"],
  },

  // -------------------------------------------------------------------------
  // SECURITY HEADERS — Applied to every response
  // Protects against: Clickjacking, XSS, MIME sniffing, information leakage
  // -------------------------------------------------------------------------
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: [
          // Prevent your site from being embedded in iframes (Clickjacking defense)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Prevent browser MIME-type sniffing (stops files being run as scripts)
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Don't send full URL in Referer header when navigating to external sites
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Remove "X-Powered-By: Next.js" header that reveals your tech stack
          {
            key: "X-Powered-By",
            value: "",
          },
          // Enable browser's built-in XSS filter
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Permissions Policy — disable unused browser features
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Content Security Policy — restrict where scripts/styles/fonts can load from
          // Allows: self, Google Fonts, FontAwesome CDN, Google Analytics, WhatsApp
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-inline needed for Next.js inline scripts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
              "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https:",
              "frame-src 'self' https://www.google.com https://maps.google.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      // Extra strict headers for admin routes
      {
        source: "/admin(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
        ],
      },
      // Prevent API responses from being cached by browsers/CDNs
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;