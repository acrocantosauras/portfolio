import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/resume";

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://meetjadhav.dev"),
  title: `${profile.name} — ${profile.role}`,
  description:
    "Meet Jadhav — AI / Backend Engineer building production-grade multi-agent systems: LangGraph orchestration, RAG, LLM evaluation, full observability, and real-time computer vision.",
  keywords: [
    "Meet Jadhav",
    "AI Engineer",
    "Backend Engineer",
    "Multi-Agent Systems",
    "LangGraph",
    "RAG",
    "LLM Evaluation",
    "Computer Vision",
    "FastAPI",
    "pgvector",
    "Portfolio",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#06070b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full`}
    >
      <body className="h-full bg-ink text-paper antialiased selection:bg-signal-red selection:text-paper">
        {/* If JavaScript is unavailable, reveal content that motion would normally
            animate in — the site stays readable without its animation layer. */}
        <noscript>
          <style>{`
            [style*="opacity: 0"] { opacity: 1 !important; }
            [style*="translateY"] { transform: none !important; }
            [style*="translateX"] { transform: none !important; }
          `}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
