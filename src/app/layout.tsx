import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newton Portfolio',
  description: 'Portfolio of Newton Frank F - Creative Developer & Designer',
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
