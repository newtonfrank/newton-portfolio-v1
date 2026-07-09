import "@/styles/tokens.css";
import "./globals.css";
import "@fontsource/londrina-solid/900.css";
import "@fontsource/londrina-outline/400.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import StructuredData from "@/components/seo/StructuredData";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Newton Frank | The Nexus — Developer × Designer",
    template: "%s | Newton Frank",
  },
  description:
    "Portfolio of Newton Frank — a creative developer crafting experiences where gravity meets design. Explore projects at the intersection of code and creativity.",
  keywords: [
    "Frontend Developer",
    "Creative Developer",
    "React Developer",
    "Next.js",
    "Three.js",
    "TypeScript",
    "UI/UX Design",
    "Newton Frank",
    "Portfolio",
    "The Nexus",
  ],
  authors: [{ name: "Newton Frank F", url: "https://github.com/newtonfrank" }],
  creator: "Newton Frank F",
  publisher: "Newton Frank F",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://newtonfrank.vercel.app",
    title: "Newton Frank | The Nexus — Developer × Designer",
    description: "Portfolio of Newton Frank — crafting experiences where gravity meets design.",
    siteName: "Newton Frank — The Nexus",
    images: [
      {
        url: "/newton-profile.jpg",
        width: 1200,
        height: 630,
        alt: "Newton Frank — The Nexus Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newton Frank | The Nexus",
    description:
      "Where gravity meets design — a portfolio exploring the spectrum between code and creativity.",
    images: ["/newton-profile.jpg"],
    creator: "@newtonfrank",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://newtonfrank.vercel.app"),
};

export const viewport = {
  themeColor: "#f8f9fa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${poppins.variable} font-sans antialiased overflow-x-hidden`}
      >
        {/* Subtle grain overlay */}
        <div className="grain-overlay" />

        {/* Main content */}
        <div className="relative z-10">{children}</div>

        <Analytics />
        <StructuredData />
      </body>
    </html>
  );
}
