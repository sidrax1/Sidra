import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import type { ReactNode } from "react";

import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
 metadataBase: new URL(
   process.env.NEXT_PUBLIC_APP_URL ?? "https://sidra.com"
 ),
 title: {
   default: "Sidra — Extraordinary Craftsmanship",
   template: "%s | Sidra",
 },
 description:

    "A private luxury digital ecosystem for exceptional resin artists and handcrafted brands.",
  applicationName: "Sidra",
  authors: [
    {
      name: "Sidra",
    },
  ],
  creator: "Sidra",
  publisher: "Sidra",
  category: "Luxury handcrafted marketplace",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Sidra",
    title: "Sidra — Extraordinary Craftsmanship",
    description:
      "Discover exceptional resin artistry through a private luxury digital experience.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sidra — Extraordinary Craftsmanship",
    description:
      "Discover exceptional resin artistry through a private luxury digital experience.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {

  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#F7F4EF",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#111111",
    },
  ],
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps): React.JSX.Element {
  return (
    <html
     lang="en-IN"
     className={`${inter.variable} ${cormorantGaramond.variable}`}
     suppressHydrationWarning
    >
     <body>{children}</body>
    </html>
  );
}
