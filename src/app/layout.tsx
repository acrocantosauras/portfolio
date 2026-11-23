import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Big_Shoulders, Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
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

// The video-analytics chapter's own display face: a tall, hard, signage-style
// condensed (Big Shoulders). It is deliberately different from the name's face so
// the chapter has its own identity: cinematic computer vision, not just a heading.
const vision = Big_Shoulders({
  variable: "--font-vision",
  subsets: ["latin"],
});

// The human voice of the site: pull-quotes, identity and journey prose.
const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  // Update to the custom domain if/when one is attached.
  metadataBase: new URL(profile.portfolioUrl),
  title: `${profile.name} — ${profile.role}`,
  description:
    "Meet Jadhav — AI / Backend Engineer in Pune. Builds reliable, tested LLM systems in Python: a checkpointed multi-agent orchestrator (AegisForge), an LLM evaluation platform with CI quality gates, and a full-stack RAG application.",
  keywords: [
    "Meet Jadhav",
    "AI Engineer",
    "Backend Engineer",
    "Multi-Agent Systems",
    "LangGraph",
    "RAG",
    "LLM Evaluation",
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
      className={`${display.variable} ${body.variable} ${mono.variable} ${serif.variable} ${vision.variable} h-full`}
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
