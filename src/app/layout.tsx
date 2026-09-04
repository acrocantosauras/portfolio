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
  description: profile.summary,
  keywords: [
    "Meet Jadhav",
    "AI Engineer",
    "Backend Engineer",
    "LLM Evaluation",
    "RAG",
    "FastAPI",
    "Python Developer",
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
  themeColor: "#0a0a0d",
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
        {children}
      </body>
    </html>
  );
}
