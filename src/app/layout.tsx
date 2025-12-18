import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sacramento } from 'next/font/google';
import { SmoothCursor } from '@/components/ui/smooth-cursor';
import { GrainOverlay } from '@/components/ui/grain-overlay';
import { SmoothScroll } from '@/components/ui/smooth-scroll';
import { Navbar } from '@/components/ui/navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sacramento = Sacramento({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-sacramento'
});

export const metadata: Metadata = {
  title: 'Newton Portfolio | Full Stack Developer & Designer',
  description: 'Portfolio of Newton Frank F - Creative Developer & Designer',
  icons: {
    icon: '/favicon.png', // Ensure this path is correct
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${sacramento.variable} font-sans bg-black text-white antialiased selection:bg-white selection:text-black cursor-none`}>
        <SmoothScroll>
          <Navbar />
          <SmoothCursor />
          <GrainOverlay />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
