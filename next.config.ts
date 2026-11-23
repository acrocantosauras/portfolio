import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

/**
 * Content-Security-Policy.
 * - 'unsafe-inline' scripts: the framework streams inline RSC/hydration payload
 *   scripts and we don't issue per-request nonces (static-friendly deploy).
 * - 'unsafe-inline' styles: motion/React set inline style attributes.
 * - Fonts are self-hosted, so no third-party font/script origins are needed.
 * - Skipped in dev: React/Next dev tooling needs eval and websockets.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'self'", // resume PDF preview uses <object>
  "frame-src 'self'",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Everything except the resume PDF. Chrome's PDF viewer renders inside
      // an <object> via an extension frame, and any X-Frame-Options header on
      // the PDF response (even SAMEORIGIN) stops it from displaying. On
      // Cloudflare the PDF is a static asset and gets no app headers at all;
      // this keeps `next dev` consistent with production.
      { source: "/((?!resume/).*)", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
