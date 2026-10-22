import type { NextConfig } from "next";

/**
 * Two deployment modes:
 *  • Server (default) — `next build && next start`, or Vercel etc. Includes the
 *    API routes (form delivery, Stripe checkout) and the order-confirmation page.
 *  • Static export — set NEXT_PUBLIC_STATIC_EXPORT=true (used for GitHub Pages).
 *    Server-only files are named *.server.ts(x) and are excluded from this build.
 */
const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = isStatic
  ? {
      output: "export",
      basePath,
      trailingSlash: true,
      images: { unoptimized: true },
      pageExtensions: ["tsx", "ts"],
    }
  : {
      basePath,
      images: { formats: ["image/avif", "image/webp"] },
      pageExtensions: ["tsx", "ts", "server.tsx", "server.ts"],
      async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
      },
    };

export default nextConfig;
