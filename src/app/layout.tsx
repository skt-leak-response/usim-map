import '@/styles/tailwind.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import { SiteConfig } from '@/constants/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: SiteConfig.title,
  description: SiteConfig.url,
  authors: [{ name: SiteConfig.author.name }],
  referrer: 'origin-when-cross-origin',
  creator: SiteConfig.author.name,
  publisher: SiteConfig.author.name,
  metadataBase: new URL(SiteConfig.url),
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      '/favicon.ico',
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: '/favicon.ico',
      url: '/favicon.ico',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    images: [
      {
        url: '/og_image_1200x630.png',
        width: 1200,
        height: 630,
        alt: 'OG Image',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-400">로딩 중...</p>
                </div>
              </div>
            }
          >
            {children}
          </Suspense>
        </ErrorBoundary>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${SiteConfig.googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${SiteConfig.googleAnalyticsId}');
        `}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}
