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

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'Newton | Dev-OS v2.0',
  description: 'High-Precision Development Environment',
  icons: {
    icon: '/favicon.png',
  },
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
      </body>
    </html>
  );
}
