import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import { Geist } from "next/font/google";

import "./globals.css";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });


export const metadata: Metadata = {
  title: "RevAdOps - Unlock Your Ad Revenue Potential with Intelligent Ad Operations",
  description: "RevAdOps helps publishers and app developers maximize revenue, improve fill rates, and maintain healthy traffic quality through advanced AdTech solutions and data-driven optimization.",
  keywords: "ad revenue, programmatic advertising, header bidding, ad monetization, publishers, app developers, adtech",
  authors: [{ name: "RevAdOps Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
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
        {children}
      </body>
    </html>
  );
}
