import "@/styles/tokens.css";
import "@/styles/reset.css";
import "@/styles/typography.css";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import StructuredData from "@/components/seo/StructuredData";
import { anton, clashDisplay, generalSans } from "@/lib/fonts";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Newton Frank — Fullstack Developer & Product Designer",
    template: "%s · Newton Frank",
  },
  description:
    "Newton Frank is a fullstack developer and product designer in Bengaluru, building real-time dashboards, scalable UI systems, and polished product interfaces.",
  keywords: [
    "Fullstack Developer",
    "Frontend Developer",
    "Product Designer",
    "React",
    "Next.js",
    "TypeScript",
    "Real-time dashboards",
    "Design systems",
    "Bengaluru",
    "Newton Frank",
  ],
  authors: [{ name: "Newton Frank", url: "https://github.com/newtonfrank" }],
  creator: "Newton Frank",
  publisher: "Newton Frank",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://newtonfrank.vercel.app",
    title: "Newton Frank — Fullstack Developer & Product Designer",
    description:
      "Real-time dashboards, scalable UI systems, and polished product interfaces — engineering-led, design-obsessed.",
    siteName: "Newton Frank",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Newton Frank — Fullstack Developer & Product Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newton Frank — Fullstack Developer & Product Designer",
    description: "Real-time dashboards, scalable UI systems, and polished product interfaces.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://newtonfrank.vercel.app"),
};

export const viewport = {
  // Matches the light editorial surface the hero now shares, so mobile browser
  // chrome blends into the first paint rather than banding against it.
  themeColor: "#f4f3ee",
  // The hero is a full-bleed dark field; letterboxing it inside the safe area
  // would band it against the display cutout. `cover` runs it edge to edge, and
  // --container-pad folds in env(safe-area-inset-*) so content still clears the
  // notch when the phone is held sideways.
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} ${clashDisplay.variable} ${generalSans.variable} ${anton.variable}`}
    >
      <body>
        {children}
        <Analytics />
        <StructuredData />
      </body>
    </html>
  );
}
