import type { Metadata, Viewport } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import { Geist } from "next/font/google";

import "./globals.css";
import { ArticleCacheProvider } from "@/contexts/ArticleCacheContext";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "RevAdOps - Unlock Your Ad Revenue Potential with Intelligent Ad Operations",
  description: "RevAdOps helps publishers and app developers maximize revenue, improve fill rates, and maintain healthy traffic quality through advanced AdTech solutions and data-driven optimization.",
  keywords: "ad revenue, programmatic advertising, header bidding, ad monetization, publishers, app developers, adtech",
  authors: [{ name: "RevAdOps Team" }],
  robots: "index, follow",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/revadops-logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/revadops-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} antialiased`}
      >
        <ArticleCacheProvider>
          {children}
        </ArticleCacheProvider>
      </body>
    </html>
  );
}
