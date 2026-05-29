import type { Metadata } from 'next';
import './globals.css';
import { Web3Provider } from '@/components/providers/web3-provider';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/error-boundary';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'AaveBaseYield',
  description: 'Institutional-grade yield on Base Mainnet, powered by Aave.',
  icons: {
    icon: [
      { url: '/cat.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/cat.jpg', sizes: '16x16', type: 'image/jpeg' },
    ],
    apple: '/cat.jpg',
  },
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ErrorBoundary>
            <Web3Provider>
              <TooltipProvider>
                {children}
                <Toaster />
              </TooltipProvider>
            </Web3Provider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
