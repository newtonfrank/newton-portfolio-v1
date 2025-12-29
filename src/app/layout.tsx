import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { SmoothCursor } from '@/components/ui/smooth-cursor';
import { GrainOverlay } from '@/components/ui/grain-overlay';
import { SmoothScroll } from '@/components/ui/smooth-scroll';
import { CommandPalette } from '@/components/ui/CommandPalette';
import Particles from '@/components/ui/Particles';
import { BootSequence } from '@/components/ui/BootSequence';
import { SystemMonitor } from '@/components/ui/SystemMonitor';
import { KonamiCode } from '@/components/ui/KonamiCode';
import { ActiveSectorIndicator } from '@/components/ui/ActiveSectorIndicator';
import { Analytics } from "@vercel/analytics/react";
import StructuredData from '@/components/seo/StructuredData';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: {
    default: 'Newton Frank F | Frontend Developer',
    template: '%s | Newton Frank F',
  },
  description: 'Portfolio of Newton Frank F, a passionate Frontend Developer with expertise in React.js, Next.js, and modern web technologies.',
  keywords: [
    'Frontend Developer',
    'React Developer',
    'Next.js',
    'TypeScript',
    'Web Development',
    'UI/UX Design',
    'Newton Frank',
    'Portfolio',
    'Software Engineer',
  ],
  authors: [{ name: 'Newton Frank F', url: 'https://github.com/newtonfrank' }],
  creator: 'Newton Frank F',
  publisher: 'Newton Frank F',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://newtonfrank.vercel.app',
    title: 'Newton Frank F | Frontend Developer',
    description: 'Portfolio of Newton Frank F, showcasing projects, skills, and experience in modern web development.',
    siteName: 'Newton Frank Portfolio',
    images: [
      {
        url: '/_next/image?url=%2Fnewton-profile.jpg&w=1200&q=75', // Dynamically assumes Next.js optimization or using public path
        width: 1200,
        height: 630,
        alt: 'Newton Frank F - Frontend Developer',
      },
      {
        url: '/newton-profile.jpg', // Fallback to raw public image
        width: 800,
        height: 600,
        alt: 'Newton Frank F',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newton Frank F | Frontend Developer',
    description: 'High-performance web applications and modern UI design by Newton Frank F.',
    images: ['/newton-profile.jpg'],
    creator: '@newtonfrank', // Assuming handle based on others, or standard
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://newtonfrank.vercel.app'),
};

export const viewport = {
  themeColor: '#050505',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#050505] text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-100 cursor-none overflow-x-hidden`}>
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Particles
            particleColors={['#ffffff', '#ffffff']}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
        <BootSequence />
        <KonamiCode />
        <ActiveSectorIndicator />
        <SmoothScroll>
          <CommandPalette />
          <SmoothCursor />
          <GrainOverlay />
          <SystemMonitor />
          <div className="crt-overlay" />
          <div className="vignette" />
          <div className="relative z-10">
            {children}
          </div>
        </SmoothScroll>
        <Analytics />
        <StructuredData />
      </body>
    </html>
  );
}
