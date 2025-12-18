import './globals.css';
import type { Metadata } from 'next';

// Actually, standard usage for lenis is usually a client component wrapper. 
// Let's create a Client Layout wrapper or just import it if it's a client component.
// @studio-freight/react-lenis is a client component usually.

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
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
